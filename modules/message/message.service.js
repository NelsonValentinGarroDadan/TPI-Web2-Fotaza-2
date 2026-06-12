const messageRepository = require("./message.repository");
const publicationRepository = require("../publication/publication.repository");
const userRepository = require("../user/user.repository");
const notificationService = require("../notification/notification.service");
const { emitToUser } = require("../../config/socket");
const AppError = require("../../errors/appError");
const { shapeMessage, shapeHeader, shapeConversation } = require("./message.functions");

const INTEREST_GREETING = "Hola! Me interesa obtener esta imagen.";

const assertParticipant = (conv, userId) => {
    if (!conv) throw new AppError(404, "Conversacion no encontrada.");
    if (conv.buyer_id !== userId && conv.seller_id !== userId)
        throw new AppError(403, "No tenes acceso a esta conversacion.");
};

module.exports = {
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
