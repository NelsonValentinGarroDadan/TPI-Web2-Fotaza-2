const  { Router} = require('express');
const authController = require('./auth.controller');
const ValidatorHandler = require('../../middlewares/validatorHandler');
const { registerDTO } = require('./auth.dto');
const uploadHandler = require('../../middlewares/uploadHandler');
const authRoutes = Router(); 

authRoutes.get("/login", authController.login);

authRoutes.get("/register", authController.registerRenderView);
authRoutes.post("/register", uploadHandler("Fotaza-2")("profile_img") ,ValidatorHandler(registerDTO) ,authController.register);

module.exports = authRoutes;