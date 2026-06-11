const { Collection, Publication } = require("../../models");

module.exports = {
    createCollection: (data) => Collection.create(data),

    getCollectionsByUser: (userId) =>
        Collection.findAll({
            where: { user_id: userId },
            include: [{
                model: Publication,
                as: "publications",
                attributes: ["id"],
                through: { attributes: [] },
                required: false,
            }],
            order: [["name", "ASC"]],
        }),

    findOwned: (id, userId) => Collection.findOne({ where: { id, user_id: userId } }),

    findByName: (userId, name) => Collection.findOne({ where: { user_id: userId, name } }),

    deleteCollection: (id) => Collection.destroy({ where: { id } }),
};
