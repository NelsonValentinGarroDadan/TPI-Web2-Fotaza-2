const { Router } = require('express');
const userController = require('./user.controller');
const requireAuth = require('../../middlewares/requireAuth');
const ValidatorHandler = require('../../middlewares/validatorHandler');
const uploadHandler = require('../../middlewares/uploadHandler');
const { updateProfileDTO } = require('./user.dto');
const userRoutes = Router();

userRoutes.use(requireAuth);
userRoutes.get("/", userController.profileRenderView);

userRoutes.put(
    "/", 
    uploadHandler("Fotaza-2")("profile_img"),
    ValidatorHandler(updateProfileDTO),
    userController.updateProfile
);

module.exports = userRoutes;
