const { Router } = require('express');
const adminController = require('./admin.controller');
const requireAuth = require('../../middlewares/requireAuth');
const adminRoutes = Router();

adminRoutes.get("/", requireAuth("admin"), adminController.dashboardRenderView);

module.exports = adminRoutes;
