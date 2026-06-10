const { Router } = require('express');
const multer = require('multer');
const publicationController = require('./publication.controller');
const requireAuth = require('../../middlewares/requireAuth');
const requireAuthPage = require('../../middlewares/requireAuthPage');
const publicationRoutes = Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
});

publicationRoutes.get("/", requireAuthPage("auth"), publicationController.uploadRenderView);

publicationRoutes.get("/:id/edit", requireAuthPage("auth"), publicationController.editRenderView);

publicationRoutes.post("/", requireAuth, upload.array("images", 10), publicationController.createPublication);

publicationRoutes.put("/:id", requireAuth, upload.array("images", 10), publicationController.updatePublication);

publicationRoutes.post("/images/:id/rating", requireAuth, publicationController.rateImage);

module.exports = publicationRoutes;
