const  { Router} = require('express');
const authController = require('./auht.controller');
const authRoutes = Router(); 

authRoutes.get("/login", authController.login);

authRoutes.post("/register", authController.register)

module.exports = authRoutes;