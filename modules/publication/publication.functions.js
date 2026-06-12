const sharp = require("sharp");
const cloudinary = require("../../config/cloudinary");
const { cardImage, detailImage, avatarImage } = require("../../utils/cloudinaryUrl");
const { formatDate } = require("../../utils/date");

const uploadBuffer = (buffer) =>
    new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "fotaza/publications" },
            (err, result) => (err ? reject(err) : resolve(result))
        );
        stream.end(buffer);
    });

const escapeXml = (text) =>
    text.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c]));

const signBuffer = async (buffer, text) => {
    const image = sharp(buffer);
    const { width = 800, height = 600 } = await image.metadata();

    const fontSize = Math.max(18, Math.round(width / 25));
    const pad = Math.round(fontSize * 0.6);
    const stroke = Math.max(1, Math.round(fontSize / 14));

    const svg = `<svg width="${width}" height="${height}">
        <text x="${width - pad}" y="${height - pad}" text-anchor="end"
            font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="bold"
            fill="#ffffff" fill-opacity="0.85"
            stroke="#000000" stroke-opacity="0.6" stroke-width="${stroke}" paint-order="stroke">${escapeXml(text)}</text>
    </svg>`;

    return image
        .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
        .toBuffer();
};

const parseTags = (raw) => [
    ...new Set((raw || "").split(",").map((t) => t.trim().toLowerCase()).filter(Boolean)),
];

const prepareImages = async (files, meta) => {
    const prepared = [];

    for (let i = 0; i < files.length; i++) {
        const info = meta[i] || {};
        const copyright = info.license === "copyright";
        const text = copyright && info.watermark ? info.watermark.trim() : null;

        const buffer = text ? await signBuffer(files[i].buffer, text) : files[i].buffer;
        const up = await uploadBuffer(buffer);

        prepared.push({
            url: up.secure_url,
            text_markwater: text,
            license: copyright ? "copyright" : "sin_copyright",
        });
    }

    return prepared;
};

const aggregateRatings = (ratings = []) => {
    const count = ratings.length;
    const average = count
        ? Math.round((ratings.reduce((sum, r) => sum + r.value, 0) / count) * 10) / 10
        : 0;
    return { average, count };
};

const shapeImage = (img, viewerId, { withCommentReports = false } = {}) => {
    const ratings = img.ratings || [];
    const { average, count } = aggregateRatings(ratings);
    const mine = ratings.find((r) => r.user_id === viewerId);

    const comments = (img.comments || [])
        .slice()
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        .map((c) => {
            const shaped = {
                id: c.id,
                userId: c.user_id,
                author: c.user ? c.user.nickname : "usuario",
                content: c.content,
                date: formatDate(c.createdAt),
            };

            if (withCommentReports) {
                const reports = c.reports || [];
                shaped.reportsCount = reports.length;
                shaped.reports = reports.map((r) => ({
                    reason: r.reason,
                    description: r.description,
                    reporter: r.user ? r.user.nickname : "usuario",
                    date: formatDate(r.createdAt),
                }));
            }

            return shaped;
        });

    return {
        id: img.id,
        url: detailImage(img.url),
        license: img.license,
        rating: average,
        ratingsCount: count,
        rated: Boolean(mine),
        myRating: mine ? mine.value : null,
        comments,
        commentsCount: comments.length,
    };
};

const shapePublication = (p, { authenticated = true, viewerId, withAuthor = false, followingIds = null } = {}) => {
    const visible = authenticated
        ? (p.images || [])
        : (p.images || []).filter((i) => i.license === "sin_copyright");

    if (!visible.length) return null;

    const tags = [
        ...new Set(visible.flatMap((i) => (i.tags || []).map((t) => t.title))),
    ];

    const images = visible.map((img) => shapeImage(img, viewerId));

    const { average: pubRating, count: pubRatingsCount } = aggregateRatings(
        visible.flatMap((i) => i.ratings || [])
    );

    const shaped = {
        id: p.id,
        title: p.title,
        description: p.description,
        cover: cardImage(visible[0].url),
        imageCount: images.length,
        images,
        tags,
        rating: pubRating,
        ratingsCount: pubRatingsCount,
        commentsEnabled: Boolean(p.comments_enabled),
        commentsCount: images.reduce((s, im) => s + im.commentsCount, 0),
    };

    if (withAuthor) {
        const author = p.author || {};
        shaped.author = {
            id: author.id,
            nickname: author.nickname,
            profile_img: avatarImage(author.profile_img),
            isFollowing: followingIds ? followingIds.has(author.id) : false,
        };
    }

    return shaped;
};

const interleaveTiers = (tiers) => {
    const result = [];
    const seen = new Set();
    const pointers = tiers.map((t) => ({ head: 0, tail: t.length - 1 }));

    const pull = (i, fromHead) => {
        const tier = tiers[i];
        const p = pointers[i];
        while (p.head <= p.tail) {
            const item = tier[fromHead ? p.head++ : p.tail--];
            if (item && !seen.has(item.id)) {
                seen.add(item.id);
                return item;
            }
        }
        return null;
    };

    let progress = true;
    while (progress) {
        progress = false;
        for (let i = 0; i < tiers.length; i++) {
            const item = pull(i, true);
            if (item) { result.push(item); progress = true; }
        }
        for (let i = 0; i < tiers.length; i++) {
            const item = pull(i, false);
            if (item) { result.push(item); progress = true; }
        }
    }

    return result;
};

module.exports = {
    parseTags,
    prepareImages,
    aggregateRatings,
    shapeImage,
    shapePublication,
    interleaveTiers,
};
