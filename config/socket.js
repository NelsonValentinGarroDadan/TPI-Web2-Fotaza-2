const { Server } = require("socket.io");
const cookie = require("cookie");
const { verify } = require("./jwt");

let io = null;

const initSocket = (httpServer) => {
    io = new Server(httpServer);

    io.use((socket, next) => {
        try {
            const raw = socket.handshake.headers.cookie || "";
            const token = cookie.parse(raw).token;
            if (!token) return next(new Error("No autenticado"));

            socket.user = verify(token);
            next();
        } catch {
            next(new Error("No autenticado"));
        }
    });

    io.on("connection", (socket) => {
        socket.join(`user:${socket.user.id}`);
        require("../modules/message/message.socket")(socket);
    });

    return io;
};

const emitToUser = (userId, event, payload) => {
    if (io) io.to(`user:${userId}`).emit(event, payload);
};

module.exports = { initSocket, emitToUser };
