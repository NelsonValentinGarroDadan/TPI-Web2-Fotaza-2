const {Router} = require('express');
const authRoutes = require('../modules/auth/auth.routes.js');
const userRoutes = require('../modules/user/user.routes.js');
const publicationRoutes = require('../modules/publication/publication.routes.js');
const publicationController = require('../modules/publication/publication.controller.js');
const router = Router();


router.get("/", publicationController.homeRenderView);
router.get("/foryou", publicationController.forYouRenderView);
router.get("/search", publicationController.searchRenderView);
router.get("/feed/following", publicationController.followingFeed);
router.get("/feed/foryou", publicationController.forYouFeed);
router.get("/feed/search", publicationController.searchFeed);
router.use("/autentication", authRoutes);
router.use("/profile", userRoutes);
router.use("/upload", publicationRoutes);

module.exports =  router;