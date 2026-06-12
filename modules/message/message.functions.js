const { cardImage, detailImage, avatarImage } = require("../../utils/cloudinaryUrl");

const shapeMessage = (m) => ({
    id: m.id,
    conversationId: m.conversation_id,
    senderId: m.sender_id,
    content: m.content,
    image: m.image ? detailImage(m.image.url) : null,
    read: Boolean(m.read_at),
    createdAt: m.createdAt,
});

const shapeHeader = (conv, viewerId) => {
    const isBuyer = conv.buyer_id === viewerId;
    const other = isBuyer ? conv.seller : conv.buyer;

    return {
        id: conv.id,
        imageId: conv.image_id,
        imageThumb: conv.image ? cardImage(conv.image.url) : null,
        role: isBuyer ? "buyer" : "seller",
        other: {
            id: other ? other.id : null,
            nickname: other ? other.nickname : "usuario",
            profile_img: avatarImage(other ? other.profile_img : null),
        },
    };
};

const shapeConversation = (conv, viewerId) => {
    const messages = conv.messages || [];
    const last = messages[messages.length - 1] || null;
    const unread = messages.filter((m) => m.sender_id !== viewerId && !m.read_at).length;

    return {
        ...shapeHeader(conv, viewerId),
        lastMessage: last
            ? { content: last.content, senderId: last.sender_id, createdAt: last.createdAt }
            : null,
        unread,
        updatedAt: last ? last.createdAt : conv.createdAt,
    };
};

module.exports = {
    shapeMessage,
    shapeHeader,
    shapeConversation,
};
