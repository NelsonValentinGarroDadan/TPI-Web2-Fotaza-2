const  { Router} = require('express');
const authController = require('./auth.controller');
const ValidatorHandler = require('../../middlewares/validatorHandler');
const { registerDTO, loginDTO } = require('./auth.dto');
const uploadHandler = require('../../middlewares/uploadHandler');
const redirectIfAuth = require('../../middlewares/redirectIfAuth');
const authRoutes = Router();

authRoutes.get("/login", redirectIfAuth(), authController.loginRednderView);
authRoutes.post("/login", ValidatorHandler(loginDTO),authController.login);

authRoutes.get("/register", redirectIfAuth(), authController.registerRenderView);
authRoutes.post("/register", uploadHandler("Fotaza-2")("profile_img") ,ValidatorHandler(registerDTO) ,authController.register);

authRoutes.post("/logout", authController.logout);

module.exports = authRoutes;