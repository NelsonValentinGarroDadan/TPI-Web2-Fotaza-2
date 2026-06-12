const messageRepository = require("./message.repository");
const publicationRepository = require("../publication/publication.repository");
const userRepository = require("../user/user.repository");
const notificationService = require("../notification/notification.service");
const { emitToUser } = require("../../config/socket");
const { cardImage, detailImage, avatarImage } = require("../../utils/cloudinaryUrl");
const AppError = require("../../errors/appError");

const shapeMessage = (m) => ({
    id: m.id,
    conversationId: m.conversation_id,
    senderId: m.sender_id,
    content: m.content,
    image: m.image ? detailImage(m.image.url) : null,
    read: Boolean(m.read_at),
    createdAt: m.createdAt,
});

const INTEREST_GREETING = "Hola! Me interesa obtener esta imagen.";

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

const assertParticipant = (conv, userId) => {
    if (!conv) throw new AppError(404, "Conversacion no encontrada.");
    if (conv.buyer_id !== userId && conv.seller_id !== userId)
        throw new AppError(403, "No tenes acceso a esta conversacion.");
};

module.exports = {
    shapeMessage,
    shapeConversation,

    createInterest: async (userId, imageId) => {
        const image = await publicationRepository.getImageById(imageId);
        if (!image || !image.publication || image.publication.deleted)
            throw new AppError(404, "Imagen no encontrada.");

        if (image.license !== "copyright")
            throw new AppError(400, "Solo las imagenes con licencia se pueden solicitar.");

        const sellerId = image.publication.user_id;
        if (sellerId === userId)
            throw new AppError(403, "No podes mostrar interes en tu propia publicacion.");

        let conversation = await messageRepository.findConversation(imageId, userId);
        let created = false;

        if (!conversation) {
            const buyer = await userRepository.getProfileById(userId);
            if (!buyer) throw new AppError(401, "Tu sesion no es valida. Cerra sesion y volve a iniciar sesion.");

            conversation = await messageRepository.createConversation({
                image_id: imageId,
                buyer_id: userId,
                seller_id: sellerId,
            });
            created = true;

            await messageRepository.createMessage({
                conversation_id: conversation.id,
                sender_id: userId,
                image_id: imageId,
                content: INTEREST_GREETING,
            });
        }

        const full = await messageRepository.getConversationWithMessages(conversation.id);

        if (created) {
            emitToUser(sellerId, "conversation:new", shapeConversation(full, sellerId));
            emitToUser(userId, "conversation:new", shapeConversation(full, userId));
            notificationService.notify({
                recipientId: sellerId,
                actorId: userId,
                type: "interest",
                imageId,
            });
        }

        return { conversation: shapeConversation(full, userId), created };
    },

    getInterestStatus: async (userId, imageId) => {
        const conversation = await messageRepository.findConversation(imageId, userId);
        return { exists: Boolean(conversation), conversationId: conversation ? conversation.id : null };
    },

    listConversations: async (userId) => {
        const conversations = await messageRepository.getConversationsForUser(userId);

        return conversations
            .map((conv) => shapeConversation(conv, userId))
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    },

    getConversation: async (userId, conversationId) => {
        const conv = await messageRepository.getConversationById(conversationId);
        assertParticipant(conv, userId);

        const messages = await messageRepository.getMessages(conversationId);
        await messageRepository.markMessagesRead(conversationId, userId);

        return {
            conversation: shapeHeader(conv, userId),
            messages: messages.map(shapeMessage),
        };
    },

    sendMessage: async (userId, conversationId, content) => {
        const text = (content || "").trim();
        if (!text) throw new AppError(400, "El mensaje no puede estar vacio.");
        if (text.length > 1000) throw new AppError(400, "El mensaje es demasiado largo.");

        const conv = await messageRepository.getRawConversation(conversationId);
        assertParticipant(conv, userId);

        const recipientId = conv.buyer_id === userId ? conv.seller_id : conv.buyer_id;
        const message = await messageRepository.createMessage({
            conversation_id: conversationId,
            sender_id: userId,
            content: text,
        });

        const shaped = shapeMessage(message);

        emitToUser(userId, "message:new", shaped);
        emitToUser(recipientId, "message:new", shaped);

        return { message: shaped, recipientId };
    },

    markRead: async (userId, conversationId) => {
        const conv = await messageRepository.getRawConversation(conversationId);
        assertParticipant(conv, userId);
        await messageRepository.markMessagesRead(conversationId, userId);
        return { read: true };
    },
};
