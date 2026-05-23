const app = require('./config/server');
require('dotenv').config();
const { connectDB } = require('./config/DB.js')

const PORT = process.env.PORT || 3000;

app.listen(PORT,async ()=> {
    await connectDB();
    console.log("Server run on port:", PORT)
});