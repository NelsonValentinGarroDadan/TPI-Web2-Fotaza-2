const { Router } = require('express');
const publicationController = require('./publication.controller');
const requireAuthPage = require('../../middlewares/requireAuthPage');
const publicationRoutes = Router();

publicationRoutes.get("/", requireAuthPage("auth"), publicationController.uploadRenderView);

module.exports = publicationRoutes;
