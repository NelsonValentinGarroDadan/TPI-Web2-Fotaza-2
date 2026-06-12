const notificationRepository = require("./notification.repository");
const { emitToUser } = require("../../config/socket");
const { shapeNotification } = require("./notification.functions");

module.exports = {
    notify: async ({ recipientId, actorId, type, imageId = null }) => {
        try {
            if (!recipientId || recipientId === actorId) return;

            const created = await notificationRepository.create({
                user_id: recipientId,
                actor_id: actorId,
                type,
                image_id: imageId,
            });

            const full = await notificationRepository.getById(created.id);
            emitToUser(recipientId, "notification:new", shapeNotification(full));
        } catch {
        }
    },

    listForUser: async (userId) => {
        const notifications = await notificationRepository.getForUser(userId);
        return notifications.map(shapeNotification);
    },

    getUnreadCount: (userId) => notificationRepository.countUnread(userId),

    markRead: async (userId, id) => {
        await notificationRepository.markRead(id, userId);
        const unread = await notificationRepository.countUnread(userId);
        return { read: true, unread };
    },

    markAllRead: async (userId) => {
        await notificationRepository.markAllRead(userId);
        return { read: true, unread: 0 };
    },
};
