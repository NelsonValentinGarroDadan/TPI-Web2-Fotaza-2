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

const watermarkUrl = (publicId, text) =>
    cloudinary.url(publicId, {
        secure: true,
        transformation: [
            {
                overlay: { font_family: "Arial", font_size: 60, text },
                color: "white",
                opacity: 60,
                gravity: "south_east",
                x: 20,
                y: 20,
            },
        ],
    });

const parseTags = (raw) => [
    ...new Set((raw || "").split(",").map((t) => t.trim().toLowerCase()).filter(Boolean)),
];

module.exports = {
    createPublication: async (userId, { title, description, tags }, files, meta) => {
        if (!title?.trim()) throw new AppError(400, "El titulo es obligatorio.");
        if (!files?.length) throw new AppError(400, "Subi al menos una imagen.");

        const tagNames = parseTags(tags);
        if (!tagNames.length) throw new AppError(400, "Agrega al menos una etiqueta.");

        const uploads = await Promise.all(files.map((file) => uploadBuffer(file.buffer)));

        return sequelize.transaction(async (transaction) => {
            const publication = await publicationRepository.createPublication(
                { user_id: userId, title: title.trim(), description: description?.trim() || null },
                transaction
            );

            const tagInstances = await Promise.all(
                tagNames.map((name) => publicationRepository.findOrCreateTag(name, transaction))
            );

            for (let i = 0; i < uploads.length; i++) {
                const up = uploads[i];
                const info = meta[i] || {};
                const copyright = info.license === "copyright";

                const image = await publicationRepository.createImage(
                    {
                        publication_id: publication.id,
                        url: up.secure_url,
                        url_markwater: copyright && info.watermark ? watermarkUrl(up.public_id, info.watermark) : null,
                        order_number: i,
                        license: copyright ? "copyright" : "sin_copyright",
                    },
                    transaction
                );

                await image.addTags(tagInstances, { transaction });
            }

            return publication;
        });
    },
};
