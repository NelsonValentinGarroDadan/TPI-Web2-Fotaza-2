const { cardImage, avatarImage } = require("../../utils/cloudinaryUrl");
const { formatDateTime } = require("../../utils/date");

const TEXTS = {
    comment: "comento una de tus imagenes",
    rating: "valoro una de tus imagenes",
    interest: "mostro interes en una de tus imagenes",
    follow: "comenzo a seguirte",
    report: "denuncio un comentario de tu publicacion",
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
        date: formatDateTime(n.createdAt),
        createdAt: n.createdAt,
    };
};

module.exports = {
    shapeNotification,
};
