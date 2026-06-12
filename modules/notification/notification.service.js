const notificationRepository = require("./notification.repository");
const { emitToUser } = require("../../config/socket");
const { cardImage, avatarImage } = require("../../utils/cloudinaryUrl");

const TEXTS = {
    comment: "comento una de tus imagenes",
    rating: "valoro una de tus imagenes",
    interest: "mostro interes en una de tus imagenes",
    follow: "comenzo a seguirte",
    report: "denuncio un comentario de tu publicacion",
};

const formatDate = (date) => {
    try {
        return new Date(date).toLocaleString("es-AR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch {
        return "";
    }
};

const buildHref = (type, actorId, publicationId) => {
    if (type === "follow") return actorId ? `/profile/${actorId}` : "/profile";
    return publicationId ? `/profile?publication=${publicationId}` : "/profile";
};

const shapeNotification = (n) => {
    const actor = n.actor || {};
    const publicationId = n.image ? n.image.publication_id : null;

    return {
        id: n.id,
        type: n.type,
        text: TEXTS[n.type] || "interactuo con tu contenido",
        actor: {
            id: actor.id || null,
            nickname: actor.nickname || "usuario",
            profile_img: avatarImage(actor.profile_img),
        },
        imageThumb: n.image ? cardImage(n.image.url) : null,
        href: buildHref(n.type, actor.id, publicationId),
        read: Boolean(n.read_at),
        date: formatDate(n.createdAt),
        createdAt: n.createdAt,
    };
};

module.exports = {
    shapeNotification,

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
