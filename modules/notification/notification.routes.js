const { Router } = require('express');
const notificationController = require('./notification.controller');
const requireAuth = require('../../middlewares/requireAuth');
const requireAuthPage = require('../../middlewares/requireAuthPage');
const notificationRoutes = Router();

notificationRoutes.get("/", requireAuthPage("auth"), notificationController.renderView);

notificationRoutes.use(requireAuth());

notificationRoutes.get("/unread-count", notificationController.unreadCount);

notificationRoutes.patch("/read-all", notificationController.markAllRead);

notificationRoutes.patch("/:id/read", notificationController.markRead);

module.exports = notificationRoutes;
