const express = require('express');
const cors = require('cors')
const router = require('./router.js');
const authRoutes = require('../modules/auth/auth.routes.js');
const errorsHandler = require('../middlewares/errorsHandler.js')
const path = require('path');


const app = express();

app.use(express.json());
app.use(cors())
app.use(errorsHandler);
app.use(express.static('public'));

app.set('view engine', 'pug');

app.set(
    'views',
    path.join(__dirname, '../views')
);

app.use("/autentication", authRoutes);
//middleware de JWT
app.use(router);

module.exports = app;