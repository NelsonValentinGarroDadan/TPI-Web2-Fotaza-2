const { Publication, Image, Tag, Rating } = require("../../models");

module.exports = {
    getPublicationsByUser: (userId) =>
        Publication.findAll({
            where: { user_id: userId, deleted: false },
            include: [{
                model: Image,
                as: "images",
                attributes: ["url", "order_number", "license"],
                separate: true,
                order: [["order_number", "ASC"]],
                include: [{
                    model: Tag,
                    as: "tags",
                    attributes: ["title"],
                    through: { attributes: [] },
                }],
            }, {
                model: Rating,
                as: "ratings",
                attributes: ["user_id", "score"],
                separate: true,
            }],
            order: [["createdAt", "DESC"]],
        }),

    getPublicationById: (id) => Publication.findByPk(id),

    getPublicationWithImages: (id) =>
        Publication.findByPk(id, {
            include: [{
                model: Image,
                as: "images",
                attributes: ["id", "url", "license", "text_markwater", "order_number"],
                include: [{
                    model: Tag,
                    as: "tags",
                    attributes: ["title"],
                    through: { attributes: [] },
                }],
            }],
            order: [[{ model: Image, as: "images" }, "order_number", "ASC"]],
        }),

    updatePublication: (id, data, transaction) =>
        Publication.update(data, { where: { id }, transaction }),

    deleteImages: (ids, transaction) =>
        ids.length ? Image.destroy({ where: { id: ids }, transaction }) : Promise.resolve(0),

    findRating: (userId, publicationId) =>
        Rating.findOne({ where: { user_id: userId, publication_id: publicationId } }),

    createRating: (data) => Rating.create(data),

    getRatings: (publicationId) =>
        Rating.findAll({ where: { publication_id: publicationId }, attributes: ["score"] }),

    createPublication: (data, transaction) => Publication.create(data, { transaction }),

    createImage: (data, transaction) => Image.create(data, { transaction }),

    findOrCreateTag: (title, transaction) =>
        Tag.findOrCreate({ where: { title }, transaction }).then(([tag]) => tag),
};
