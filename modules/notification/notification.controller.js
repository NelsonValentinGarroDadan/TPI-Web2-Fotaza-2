const notificationService = require("./notification.service.js");

module.exports = {
    renderView: async (req, res) => {
        const notifications = await notificationService.listForUser(req.user.id);
        const unread = notifications.filter((n) => !n.read).length;

        res.render("notification/notifications.pug", { notifications, unread });
    },

    unreadCount: async (req, res) => {
        const count = await notificationService.getUnreadCount(req.user.id);

        res.status(200).send({ count });
    },

    markRead: async (req, res) => {
        const result = await notificationService.markRead(req.user.id, Number(req.params.id));

        res.status(200).send(result);
    },

    markAllRead: async (req, res) => {
        const result = await notificationService.markAllRead(req.user.id);

        res.status(200).send({ ...result, message: "Listo, marcamos todo como leido." });
    },
};
