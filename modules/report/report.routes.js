const { Router } = require('express');
const reportController = require('./report.controller');
const requireAuth = require('../../middlewares/requireAuth');
const ValidatorHandler = require('../../middlewares/validatorHandler');
const { reportDTO } = require('./report.dto');
const reportRoutes = Router();

reportRoutes.use(requireAuth());

reportRoutes.post("/images/:id", ValidatorHandler(reportDTO), reportController.reportImage);

reportRoutes.post("/comments/:id", ValidatorHandler(reportDTO), reportController.reportComment);

reportRoutes.delete("/images/:id", requireAuth("admin"), reportController.dismissImageReports);

reportRoutes.delete("/:id", requireAuth("admin"), reportController.dismissReport);

module.exports = reportRoutes;
