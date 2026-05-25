const  { Router} = require('express');
const authController = require('./auth.controller');
const ValidatorHandler = require('../../middlewares/validatorHandler');
const { registerDTO } = require('./auth.dto');
const authRoutes = Router(); 

authRoutes.get("/login", authController.login);

authRoutes.post("/register", ValidatorHandler(registerDTO) ,authController.register)

module.exports = authRoutes;