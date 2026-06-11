const reportRepository = require("./report.repository");
const publicationRepository = require("../publication/publication.repository");
const AppError = require("../../errors/appError");

module.exports = {
    reportImage: async (imageId, userId, { reason, description }) => {
        const image = await publicationRepository.getImageById(imageId);
        if (!image || !image.publication || image.publication.deleted)
            throw new AppError(404, "Imagen no encontrada.");

        if (image.publication.user_id === userId)
            throw new AppError(403, "No podes denunciar tu propia publicacion.");

        const existing = await reportRepository.findImageReport(userId, imageId);
        if (existing)
            throw new AppError(409, "Ya denunciaste esta imagen.");

        await reportRepository.createReport({ user_id: userId, image_id: imageId, reason, description });

        return { reported: true };
    },

    reportComment: async (commentId, userId, { reason, description }) => {
        const comment = await publicationRepository.getCommentById(commentId);
        if (!comment || !comment.image || !comment.image.publication || comment.image.publication.deleted)
            throw new AppError(404, "Comentario no encontrado.");

        const authorId = comment.image.publication.user_id;
        if (comment.user_id === authorId)
            throw new AppError(403, "No se puede denunciar un comentario del autor de la publicacion.");

        if (comment.user_id === userId)
            throw new AppError(403, "No podes denunciar tu propio comentario.");

        const existing = await reportRepository.findCommentReport(userId, commentId);
        if (existing)
            throw new AppError(409, "Ya denunciaste este comentario.");

        await reportRepository.createReport({ user_id: userId, comment_id: commentId, reason, description });

        return { reported: true };
    },
};
