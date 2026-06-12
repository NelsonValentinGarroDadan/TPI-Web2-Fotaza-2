const { Op } = require("sequelize");
const { Notification, User, Image } = require("../../models");

const actorAttrs = ["id", "nickname", "profile_img"];

const include = [
    { model: User, as: "actor", attributes: actorAttrs },
    { model: Image, as: "image", attributes: ["id", "url", "publication_id"] },
];

module.exports = {
    create: (data) => Notification.create(data),

    getById: (id) => Notification.findByPk(id, { include }),

    getForUser: (userId) =>
        Notification.findAll({
            where: { user_id: userId },
            include,
            order: [["createdAt", "DESC"]],
        }),

    countUnread: (userId) =>
        Notification.count({ where: { user_id: userId, read_at: null } }),

    markRead: (id, userId) =>
        Notification.update(
            { read_at: new Date() },
            { where: { id, user_id: userId, read_at: null } }
        ),

    markAllRead: (userId) =>
        Notification.update(
            { read_at: new Date() },
            { where: { user_id: userId, read_at: null } }
        ),
};
