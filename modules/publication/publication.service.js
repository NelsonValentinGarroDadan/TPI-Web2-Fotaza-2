const sharp = require("sharp");
const { sequelize } = require("../../models");
const cloudinary = require("../../config/cloudinary");
const publicationRepository = require("./publication.repository");
const AppError = require("../../errors/appError");

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

module.exports = {
    getUserPublications: async (userId) => {
        const publications = await publicationRepository.getPublicationsByUser(userId);

        return publications.map((p) => ({
            id: p.id,
            title: p.title,
            cover: p.images?.[0]?.url || null,
            imageCount: p.images?.length || 0,
        }));
    },

    getUserPublicationsDetailed: async (userId) => {
        const publications = await publicationRepository.getPublicationsByUser(userId);

        return publications.map((p) => {
            const images = (p.images || []).map((i) => ({ url: i.url }));
            const tags = [
                ...new Set((p.images || []).flatMap((i) => (i.tags || []).map((t) => t.title))),
            ];

            return {
                id: p.id,
                title: p.title,
                description: p.description,
                cover: images[0]?.url || null,
                imageCount: images.length,
                images,
                tags,
            };
        });
    },

    createPublication: async (userId, { title, description, tags }, files, meta) => {
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
                { user_id: userId, title: title.trim(), description: description?.trim() || null },
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
