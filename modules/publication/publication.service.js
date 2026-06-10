const sharp = require("sharp");
const { sequelize } = require("../../models");
const cloudinary = require("../../config/cloudinary");
const publicationRepository = require("./publication.repository");
const userRepository = require("../user/user.repository");
const AppError = require("../../errors/appError");
const { cardImage, detailImage, avatarImage } = require("../../utils/cloudinaryUrl");

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

const aggregateRatings = (ratings = []) => {
    const count = ratings.length;
    const average = count
        ? Math.round((ratings.reduce((sum, r) => sum + r.value, 0) / count) * 10) / 10
        : 0;
    return { average, count };
};

const formatDate = (date) => {
    try {
        return new Date(date).toLocaleDateString("es-AR");
    } catch {
        return "";
    }
};

const shapeImage = (img, viewerId) => {
    const ratings = img.ratings || [];
    const { average, count } = aggregateRatings(ratings);
    const mine = ratings.find((r) => r.user_id === viewerId);

    const comments = (img.comments || [])
        .slice()
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        .map((c) => ({
            id: c.id,
            userId: c.user_id,
            author: c.user ? c.user.nickname : "usuario",
            content: c.content,
            date: formatDate(c.createdAt),
        }));

    return {
        id: img.id,
        url: detailImage(img.url),
        rating: average,
        ratingsCount: count,
        rated: Boolean(mine),
        myRating: mine ? mine.value : null,
        comments,
        commentsCount: comments.length,
    };
};

const shapePublication = (p, { authenticated = true, viewerId, withAuthor = false } = {}) => {
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
    getUserPublicationsDetailed: async (userId, { authenticated = true, viewerId } = {}) => {
        const publications = await publicationRepository.getPublicationsByUser(userId);

        return publications.reduce((acc, p) => {
            const visible = authenticated
                ? (p.images || [])
                : (p.images || []).filter((i) => i.license === "sin_copyright");

            if (!visible.length) return acc;

            const tags = [
                ...new Set(visible.flatMap((i) => (i.tags || []).map((t) => t.title))),
            ];

            const images = visible.map((img) => shapeImage(img, viewerId));

            const { average: pubRating, count: pubRatingsCount } = aggregateRatings(
                visible.flatMap((i) => i.ratings || [])
            );
            const reportsCount = (p.reports || []).length;

            acc.push({
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
                reportsCount,
                canEdit: reportsCount === 0,
            });

            return acc;
        }, []);
    },

    getFollowingFeed: async (userId, { viewerId } = {}) => {
        const followingIds = await userRepository.getFollowingIds(userId);
        if (!followingIds.length) return [];

        const publications = await publicationRepository.getPublicationsByUsers(followingIds);

        return publications
            .map((p) => shapePublication(p, { viewerId, withAuthor: true }))
            .filter(Boolean);
    },

    getForYouFeed: async ({ authenticated = true, viewerId } = {}) => {
        const publications = await publicationRepository.getAllPublications();

        const shaped = publications
            .map((p) => shapePublication(p, { authenticated, viewerId, withAuthor: true }))
            .filter(Boolean)
            .sort((a, b) => b.rating - a.rating || b.ratingsCount - a.ratingsCount || a.id - b.id);

        const size = Math.ceil(shaped.length / 3);
        const tiers = [
            shaped.slice(0, size),
            shaped.slice(size, size * 2),
            shaped.slice(size * 2),
        ];

        return interleaveTiers(tiers);
    },

    getSearchFeed: async ({ tags = [], keywords = [], minRating, maxRating } = {}, { authenticated = true, viewerId } = {}) => {
        const publications = await publicationRepository.getAllPublications();

        let shaped = publications
            .map((p) => shapePublication(p, { authenticated, viewerId, withAuthor: true }))
            .filter(Boolean);

        if (keywords.length) {
            shaped = shaped.filter((p) => {
                const haystack = `${p.title || ""} ${p.description || ""}`.toLowerCase();
                return keywords.every((kw) => haystack.includes(kw));
            });
        }

        if (tags.length) {
            shaped = shaped.filter((p) => {
                const pubTags = (p.tags || []).map((t) => t.toLowerCase());
                return tags.every((t) => pubTags.includes(t));
            });
        }

        if (Number.isFinite(minRating)) shaped = shaped.filter((p) => p.rating >= minRating);
        if (Number.isFinite(maxRating)) shaped = shaped.filter((p) => p.rating <= maxRating);

        return shaped;
    },

    getPublicationForEdit: async (id, userId) => {
        const publication = await publicationRepository.getPublicationWithImages(id);

        if (!publication || publication.deleted)
            throw new AppError(404, "Publicacion no encontrada.");

        if (publication.user_id !== userId)
            throw new AppError(403, "No podes editar esta publicacion.");

        const reportsCount = (publication.reports || []).length;
        const images = (publication.images || []).map((img) => ({
            id: img.id,
            url: img.url,
            license: img.license,
            watermark: img.text_markwater || "",
        }));
        const tags = [
            ...new Set((publication.images || []).flatMap((i) => (i.tags || []).map((t) => t.title))),
        ];

        return {
            id: publication.id,
            title: publication.title,
            description: publication.description || "",
            tags,
            images,
            commentsEnabled: Boolean(publication.comments_enabled),
            canEdit: reportsCount === 0,
        };
    },

    updatePublication: async (id, userId, { title, description, tags, commentsEnabled }, files, meta) => {
        if (!title?.trim()) throw new AppError(400, "El titulo es obligatorio.");

        const tagNames = parseTags(tags);
        if (!tagNames.length) throw new AppError(400, "Agrega al menos una etiqueta.");

        const entries = Array.isArray(meta) ? meta : [];
        const existingEntries = entries.filter((e) => e.kind === "existing");
        const newEntries = entries.filter((e) => e.kind === "new");

        if (!entries.length) throw new AppError(400, "La publicacion debe tener al menos una imagen.");
        if (newEntries.length !== (files?.length || 0))
            throw new AppError(400, "Las imagenes nuevas no coinciden con los datos enviados.");

        const publication = await publicationRepository.getPublicationWithImages(id);
        if (!publication || publication.deleted)
            throw new AppError(404, "Publicacion no encontrada.");
        if (publication.user_id !== userId)
            throw new AppError(403, "No podes editar esta publicacion.");

        const reportsCount = (publication.reports || []).length;
        if (reportsCount > 0)
            throw new AppError(403, "Esta publicacion tiene reportes y no se puede editar.");

        const currentImages = publication.images || [];
        const imgById = new Map(currentImages.map((img) => [img.id, img]));
        const keepIds = new Set(existingEntries.map((e) => Number(e.id)));

        if (existingEntries.some((e) => !imgById.has(Number(e.id))))
            throw new AppError(400, "Una de las imagenes a conservar no pertenece a la publicacion.");

        const uploaded = [];
        for (let i = 0; i < newEntries.length; i++) {
            const info = newEntries[i] || {};
            const copyright = info.license === "copyright";
            const text = copyright && info.watermark ? info.watermark.trim() : null;

            const buffer = text ? await signBuffer(files[i].buffer, text) : files[i].buffer;
            const up = await uploadBuffer(buffer);

            uploaded.push({
                url: up.secure_url,
                text_markwater: text,
                license: copyright ? "copyright" : "sin_copyright",
            });
        }

        return sequelize.transaction(async (transaction) => {
            const updateData = { title: title.trim(), description: description?.trim() || null };
            if (typeof commentsEnabled === "boolean") updateData.comments_enabled = commentsEnabled;

            await publicationRepository.updatePublication(id, updateData, transaction);

            const tagInstances = await Promise.all(
                tagNames.map((name) => publicationRepository.findOrCreateTag(name, transaction))
            );

            const removeIds = currentImages.filter((img) => !keepIds.has(img.id)).map((img) => img.id);
            await publicationRepository.deleteImages(removeIds, transaction);

            let order = 0;
            let newIdx = 0;

            for (const entry of entries) {
                if (entry.kind === "existing") {
                    const img = imgById.get(Number(entry.id));
                    await img.update({ order_number: order }, { transaction });
                    await img.setTags(tagInstances, { transaction });
                } else {
                    const image = await publicationRepository.createImage(
                        { publication_id: id, ...uploaded[newIdx++], order_number: order },
                        transaction
                    );
                    await image.addTags(tagInstances, { transaction });
                }
                order++;
            }

            return { id };
        });
    },

    rateImage: async (imageId, userId, value) => {
        const score = Number(value);
        if (!Number.isInteger(score) || score < 1 || score > 5)
            throw new AppError(400, "La calificacion debe ser un numero del 1 al 5.");

        const image = await publicationRepository.getImageById(imageId);
        if (!image || !image.publication || image.publication.deleted)
            throw new AppError(404, "Imagen no encontrada.");

        if (image.publication.user_id === userId)
            throw new AppError(403, "No podes calificar tu propia publicacion.");

        const existing = await publicationRepository.findRating(userId, imageId);
        if (existing)
            throw new AppError(409, "Ya calificaste esta imagen.");

        await publicationRepository.createRating({
            user_id: userId,
            image_id: imageId,
            value: score,
        });

        const ratings = await publicationRepository.getRatings(imageId);
        const { average, count } = aggregateRatings(ratings);

        return { rating: average, ratingsCount: count, myRating: score };
    },

    createComment: async (imageId, userId, content) => {
        const image = await publicationRepository.getImageById(imageId);
        if (!image || !image.publication || image.publication.deleted)
            throw new AppError(404, "Imagen no encontrada.");

        if (!image.publication.comments_enabled)
            throw new AppError(403, "Los comentarios estan deshabilitados en esta publicacion.");

        const comment = await publicationRepository.createComment({
            user_id: userId,
            image_id: imageId,
            content,
        });

        const author = await userRepository.getProfileById(userId);

        return {
            id: comment.id,
            userId,
            author: author ? author.nickname : "usuario",
            content: comment.content,
            date: formatDate(comment.createdAt),
        };
    },

    createPublication: async (userId, { title, description, tags, commentsEnabled }, files, meta) => {
        if (!title?.trim()) throw new AppError(400, "El titulo es obligatorio.");
        if (!files?.length) throw new AppError(400, "Subi al menos una imagen.");

        const tagNames = parseTags(tags);
        if (!tagNames.length) throw new AppError(400, "Agrega al menos una etiqueta.");

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
                order_number: i,
            });
        }

        return sequelize.transaction(async (transaction) => {
            const publication = await publicationRepository.createPublication(
                {
                    user_id: userId,
                    title: title.trim(),
                    description: description?.trim() || null,
                    ...(typeof commentsEnabled === "boolean" ? { comments_enabled: commentsEnabled } : {}),
                },
                transaction
            );

            const tagInstances = await Promise.all(
                tagNames.map((name) => publicationRepository.findOrCreateTag(name, transaction))
            );

            for (const data of prepared) {
                const image = await publicationRepository.createImage(
                    { publication_id: publication.id, ...data },
                    transaction
                );
                await image.addTags(tagInstances, { transaction });
            }

            return publication;
        });
    },
};
