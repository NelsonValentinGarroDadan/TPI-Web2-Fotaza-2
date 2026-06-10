const { Op } = require("sequelize");
const { Publication, Image, Tag, Rating, Comment, User } = require("../../models");

const imagesInclude = {
    model: Image,
    as: "images",
    attributes: ["id", "url", "order_number", "license"],
    separate: true,
    order: [["order_number", "ASC"]],
    include: [{
        model: Tag,
        as: "tags",
        attributes: ["title"],
        through: { attributes: [] },
    }, {
        model: Rating,
        as: "ratings",
        attributes: ["user_id", "value"],
    }, {
        model: Comment,
        as: "comments",
        attributes: ["id", "content", "createdAt", "user_id"],
        include: [{ model: User, as: "user", attributes: ["id", "nickname"] }],
    }],
};

module.exports = {
    getPublicationsByUser: (userId) =>
        Publication.findAll({
            where: { user_id: userId, deleted: false },
            include: [imagesInclude],
            order: [["createdAt", "DESC"]],
        }),

    getPublicationsByUsers: (userIds) =>
        Publication.findAll({
            where: { user_id: { [Op.in]: userIds }, deleted: false },
            include: [
                { model: User, as: "author", attributes: ["id", "nickname", "profile_img"] },
                imagesInclude,
            ],
            order: [["createdAt", "DESC"]],
        }),

    getAllPublications: () =>
        Publication.findAll({
            where: { deleted: false },
            include: [
                { model: User, as: "author", attributes: ["id", "nickname", "profile_img"] },
                imagesInclude,
            ],
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

    findRating: (userId, imageId) =>
        Rating.findOne({ where: { user_id: userId, image_id: imageId } }),

    createRating: (data) => Rating.create(data),

    getRatings: (imageId) =>
        Rating.findAll({ where: { image_id: imageId }, attributes: ["value"] }),

    getImageById: (id) =>
        Image.findByPk(id, {
            include: [{ model: Publication, as: "publication", attributes: ["id", "user_id", "deleted", "comments_enabled"] }],
        }),

    createComment: (data) => Comment.create(data),

    createPublication: (data, transaction) => Publication.create(data, { transaction }),

    createImage: (data, transaction) => Image.create(data, { transaction }),

    findOrCreateTag: (title, transaction) =>
        Tag.findOrCreate({ where: { title }, transaction }).then(([tag]) => tag),
};
