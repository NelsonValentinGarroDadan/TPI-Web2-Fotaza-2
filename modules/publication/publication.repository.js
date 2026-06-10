const { Publication, Image, Tag } = require("../../models");

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
            }],
            order: [["createdAt", "DESC"]],
        }),

    createPublication: (data, transaction) => Publication.create(data, { transaction }),

    createImage: (data, transaction) => Image.create(data, { transaction }),

    findOrCreateTag: (title, transaction) =>
        Tag.findOrCreate({ where: { title }, transaction }).then(([tag]) => tag),
};
