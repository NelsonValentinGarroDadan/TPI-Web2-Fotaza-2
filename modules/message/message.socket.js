const messageService = require("./message.service");

module.exports = (socket) => {
    const userId = socket.user.id;

    socket.on("message:send", async ({ conversationId, content } = {}, ack) => {
        try {
            const { message } = await messageService.sendMessage(userId, Number(conversationId), content);
            if (typeof ack === "function") ack({ ok: true, message });
        } catch (err) {
            if (typeof ack === "function") ack({ ok: false, error: err.message || "No se pudo enviar." });
        }
    });

    socket.on("conversation:read", async ({ conversationId } = {}) => {
        try {
            await messageService.markRead(userId, Number(conversationId));
        } catch {
        }
    });
};
