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

publicationRoutes.post("/", requireAuth, upload.array("images", 10), publicationController.createPublication);

module.exports = publicationRoutes;
