require('dotenv').config();
const http = require('http');
const app = require('./config/server');
const { connectDB } = require('./config/DB.js');
const { initSocket } = require('./config/socket.js');

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
initSocket(server);

server.listen(PORT, async () => {
    await connectDB();
    console.log("Server run on port:", PORT);
});
