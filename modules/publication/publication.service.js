const { sequelize } = require("../../models");
const publicationRepository = require("./publication.repository");
const userRepository = require("../user/user.repository");
const notificationService = require("../notification/notification.service");
const AppError = require("../../errors/appError");
const { cardImage } = require("../../utils/cloudinaryUrl");
const { formatDate } = require("../../utils/date");
const {
    parseTags,
    prepareImages,
    aggregateRatings,
    shapeImage,
    shapePublication,
    interleaveTiers,
} = require("./publication.functions");

const TAKEDOWN_LIMIT = 3;

module.exports = {
    takedown: async (publicationId) => {
        const publication = await publicationRepository.getPublicationById(publicationId);
        if (!publication || publication.deleted)
            throw new AppError(404, "Publicacion no encontrada o ya dada de baja.");

        await publicationRepository.updatePublication(publicationId, { deleted: true });

        const takedowns = await publicationRepository.countTakedowns(publication.user_id);

        let accountBlocked = false;
        if (takedowns >= TAKEDOWN_LIMIT) {
            await userRepository.updateUser(publication.user_id, { active: false });
            accountBlocked = true;
        }

        return { takenDown: true, takedowns, accountBlocked };
    },
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

            const isOwner = viewerId === userId;
            const images = visible.map((img) => shapeImage(img, viewerId, { withCommentReports: isOwner }));

            const { average: pubRating, count: pubRatingsCount } = aggregateRatings(
                visible.flatMap((i) => i.ratings || [])
            );
            const reportsCount = (p.images || []).reduce((s, i) => s + ((i.reports || []).length), 0);

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
        const followingSet = new Set(followingIds);

        return publications
            .map((p) => shapePublication(p, { viewerId, withAuthor: true, followingIds: followingSet }))
            .filter(Boolean);
    },

    getForYouFeed: async ({ authenticated = true, viewerId } = {}) => {
        const publications = await publicationRepository.getAllPublications();
        const followingSet = viewerId ? new Set(await userRepository.getFollowingIds(viewerId)) : null;

        const shaped = publications
            .map((p) => shapePublication(p, { authenticated, viewerId, withAuthor: true, followingIds: followingSet }))
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
        const followingSet = viewerId ? new Set(await userRepository.getFollowingIds(viewerId)) : null;

        let shaped = publications
            .map((p) => shapePublication(p, { authenticated, viewerId, withAuthor: true, followingIds: followingSet }))
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

        const reportsCount = (publication.images || []).reduce((s, i) => s + ((i.reports || []).length), 0);
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

        const uploaded = await prepareImages(files || [], newEntries);

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

        notificationService.notify({
            recipientId: image.publication.user_id,
            actorId: userId,
            type: "rating",
            imageId,
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

        notificationService.notify({
            recipientId: image.publication.user_id,
            actorId: userId,
            type: "comment",
            imageId,
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

    deleteReportedComment: async (commentId, userId) => {
        const comment = await publicationRepository.getCommentById(commentId);
        if (!comment || !comment.image || !comment.image.publication || comment.image.publication.deleted)
            throw new AppError(404, "Comentario no encontrado.");

        if (comment.image.publication.user_id !== userId)
            throw new AppError(403, "Solo el autor de la publicacion puede borrar sus comentarios.");

        await publicationRepository.deleteComment(commentId);

        return { deleted: true };
    },

    createPublication: async (userId, { title, description, tags, commentsEnabled }, files, meta) => {
        if (!title?.trim()) throw new AppError(400, "El titulo es obligatorio.");
        if (!files?.length) throw new AppError(400, "Subi al menos una imagen.");

        const tagNames = parseTags(tags);
        if (!tagNames.length) throw new AppError(400, "Agrega al menos una etiqueta.");

        const prepared = await prepareImages(files, meta);

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

            let order = 0;
            for (const data of prepared) {
                const image = await publicationRepository.createImage(
                    { publication_id: publication.id, ...data, order_number: order++ },
                    transaction
                );
                await image.addTags(tagInstances, { transaction });
            }

            return publication;
        });
    },
};
