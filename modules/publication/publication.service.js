const sharp = require("sharp");
const { sequelize } = require("../../models");
const cloudinary = require("../../config/cloudinary");
const publicationRepository = require("./publication.repository");
const AppError = require("../../errors/appError");
const { cardImage, detailImage } = require("../../utils/cloudinaryUrl");

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
        ? Math.round((ratings.reduce((sum, r) => sum + r.score, 0) / count) * 10) / 10
        : 0;
    return { average, count };
};

module.exports = {
    getUserPublicationsDetailed: async (userId, { authenticated = true, viewerId } = {}) => {
        const publications = await publicationRepository.getPublicationsByUser(userId);

        return publications.reduce((acc, p) => {
            const visible = authenticated
                ? (p.images || [])
                : (p.images || []).filter((i) => i.license === "sin_copyright");

            if (!visible.length) return acc;

            const urls = visible.map((i) => i.url);
            const tags = [
                ...new Set(visible.flatMap((i) => (i.tags || []).map((t) => t.title))),
            ];

            const ratings = p.ratings || [];
            const { average, count } = aggregateRatings(ratings);
            const mine = ratings.find((r) => r.user_id === viewerId);

            const reportsCount = (p.reports || []).length;

            acc.push({
                id: p.id,
                title: p.title,
                description: p.description,
                cover: cardImage(urls[0]),
                imageCount: urls.length,
                images: urls.map((url) => ({ url: detailImage(url) })),
                tags,
                rating: average,
                ratingsCount: count,
                rated: Boolean(mine),
                myRating: mine ? mine.score : null,
                reportsCount,
                canEdit: reportsCount === 0,
            });

            return acc;
        }, []);
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
            canEdit: reportsCount === 0,
        };
    },

    updatePublication: async (id, userId, { title, description, tags }, files, meta) => {
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
            await publicationRepository.updatePublication(
                id,
                { title: title.trim(), description: description?.trim() || null },
                transaction
            );

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

    rate: async (publicationId, userId, score) => {
        const value = Number(score);
        if (!Number.isInteger(value) || value < 1 || value > 5)
            throw new AppError(400, "La calificacion debe ser un numero del 1 al 5.");

        const publication = await publicationRepository.getPublicationById(publicationId);
        if (!publication || publication.deleted)
            throw new AppError(404, "Publicacion no encontrada.");

        if (publication.user_id === userId)
            throw new AppError(403, "No podes calificar tu propia publicacion.");

        const existing = await publicationRepository.findRating(userId, publicationId);
        if (existing)
            throw new AppError(409, "Ya calificaste esta publicacion.");

        await publicationRepository.createRating({
            user_id: userId,
            publication_id: publicationId,
            score: value,
        });

        const ratings = await publicationRepository.getRatings(publicationId);
        const { average, count } = aggregateRatings(ratings);

        return { rating: average, ratingsCount: count, myRating: value };
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
