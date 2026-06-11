const { Router } = require('express');
const reportController = require('./report.controller');
const requireAuth = require('../../middlewares/requireAuth');
const ValidatorHandler = require('../../middlewares/validatorHandler');
const { reportDTO } = require('./report.dto');
const reportRoutes = Router();

reportRoutes.use(requireAuth);

reportRoutes.post("/images/:id", ValidatorHandler(reportDTO), reportController.reportImage);

reportRoutes.post("/comments/:id", ValidatorHandler(reportDTO), reportController.reportComment);

module.exports = reportRoutes;
