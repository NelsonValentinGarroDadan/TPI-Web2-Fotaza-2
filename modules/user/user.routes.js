const { Router } = require('express');
const userController = require('./user.controller');
const requireAuth = require('../../middlewares/requireAuth');
const requireAuthPage = require('../../middlewares/requireAuthPage');
const ValidatorHandler = require('../../middlewares/validatorHandler');
const uploadHandler = require('../../middlewares/uploadHandler');
const { updateProfileDTO } = require('./user.dto');
const userRoutes = Router();

userRoutes.get("/", requireAuthPage("auth"), userController.profileRenderView);
 
userRoutes.put(
    "/",
    requireAuth,
    uploadHandler("Fotaza-2")("profile_img"),
    ValidatorHandler(updateProfileDTO),
    userController.updateProfile
);

userRoutes.get("/:id", requireAuthPage("auth"), userController.userProfileRenderView);

userRoutes.post("/:id/follow", requireAuth, userController.follow);
userRoutes.delete("/:id/follow", requireAuth, userController.unfollow);

module.exports = userRoutes;
