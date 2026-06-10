const { Router } = require('express');
const multer = require('multer');
const publicationController = require('./publication.controller');
const requireAuth = require('../../middlewares/requireAuth');
const requireAuthPage = require('../../middlewares/requireAuthPage');
const ValidatorHandler = require('../../middlewares/validatorHandler');
const { commentDTO, ratingDTO } = require('./publication.dto');
const publicationRoutes = Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
});

publicationRoutes.get("/", requireAuthPage("auth"), publicationController.uploadRenderView);

publicationRoutes.get("/:id/edit", requireAuthPage("auth"), publicationController.editRenderView);

publicationRoutes.post("/", requireAuth, upload.array("images", 10), publicationController.createPublication);

publicationRoutes.put("/:id", requireAuth, upload.array("images", 10), publicationController.updatePublication);

publicationRoutes.post("/images/:id/rating", requireAuth, ValidatorHandler(ratingDTO), publicationController.rateImage);

publicationRoutes.post("/images/:id/comment", requireAuth, ValidatorHandler(commentDTO), publicationController.createComment);

module.exports = publicationRoutes;
