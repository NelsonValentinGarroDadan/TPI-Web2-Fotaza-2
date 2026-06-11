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

publicationRoutes.use(requireAuth)

publicationRoutes.post("/", upload.array("images", 10), publicationController.createPublication);

publicationRoutes.put("/:id", upload.array("images", 10), publicationController.updatePublication);

publicationRoutes.post("/images/:id/rating", ValidatorHandler(ratingDTO), publicationController.rateImage);

publicationRoutes.post("/images/:id/comment", ValidatorHandler(commentDTO), publicationController.createComment);

publicationRoutes.delete("/comments/:id", publicationController.deleteComment);

module.exports = publicationRoutes;
