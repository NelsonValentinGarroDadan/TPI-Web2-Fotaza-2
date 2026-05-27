const express = require('express');
const cors = require('cors')
const router = require('./router.js');
const errorsHandler = require('../middlewares/errorsHandler.js')
const path = require('path');
const cookieParser = require("cookie-parser");
const AuthHandler = require("../middlewares/authHandler.js");

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.static('public'));
app.use(AuthHandler);

app.set('view engine', 'pug');

app.set(
    'views',
    path.join(__dirname, '../views')
);

app.use(router);

app.use(errorsHandler);
module.exports = app;