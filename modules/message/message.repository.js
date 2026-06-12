const { Op } = require("sequelize");
const { Conversation, Message, Image, User } = require("../../models");

const userAttrs = ["id", "nickname", "profile_img"];

const conversationParties = [
    { model: Image, as: "image", attributes: ["id", "url"] },
    { model: User, as: "buyer", attributes: userAttrs },
    { model: User, as: "seller", attributes: userAttrs },
];

module.exports = {
    findConversation: (imageId, buyerId) =>
        Conversation.findOne({ where: { image_id: imageId, buyer_id: buyerId } }),

    createConversation: (data) => Conversation.create(data),

    getRawConversation: (id) => Conversation.findByPk(id),

    getConversationById: (id) =>
        Conversation.findByPk(id, { include: conversationParties }),

    getConversationWithMessages: (id) =>
        Conversation.findByPk(id, {
            include: [
                ...conversationParties,
                {
                    model: Message,
                    as: "messages",
                    attributes: ["id", "sender_id", "content", "read_at", "createdAt"],
                    separate: true,
                    order: [["createdAt", "ASC"]],
                },
            ],
        }),

    getConversationsForUser: (userId) =>
        Conversation.findAll({
            where: { [Op.or]: [{ buyer_id: userId }, { seller_id: userId }] },
            include: [
                ...conversationParties,
                {
                    model: Message,
                    as: "messages",
                    attributes: ["id", "sender_id", "content", "read_at", "createdAt"],
                    separate: true,
                    order: [["createdAt", "ASC"]],
                },
            ],
        }),

    getMessages: (conversationId) =>
        Message.findAll({
            where: { conversation_id: conversationId },
            include: [{ model: Image, as: "image", attributes: ["id", "url"] }],
            order: [["createdAt", "ASC"]],
        }),

    createMessage: (data) => Message.create(data),

    markMessagesRead: (conversationId, recipientId) =>
        Message.update(
            { read_at: new Date() },
            {
                where: {
                    conversation_id: conversationId,
                    sender_id: { [Op.ne]: recipientId },
                    read_at: null,
                },
            }
        ),
};
