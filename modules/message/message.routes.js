const { Router } = require('express');
const messageController = require('./message.controller');
const requireAuth = require('../../middlewares/requireAuth');
const ValidatorHandler = require('../../middlewares/validatorHandler');
const { interestDTO, sendMessageDTO } = require('./message.dto');
const messageRoutes = Router();

messageRoutes.use(requireAuth());

messageRoutes.post("/interest", ValidatorHandler(interestDTO), messageController.interest);

messageRoutes.get("/interest/:imageId", messageController.interestStatus);

messageRoutes.get("/conversations", messageController.list);

messageRoutes.get("/conversations/:id", messageController.getOne);

messageRoutes.post("/conversations/:id/messages", ValidatorHandler(sendMessageDTO), messageController.send);

module.exports = messageRoutes;
