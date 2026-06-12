const messageService = require("./message.service.js");

module.exports = {
    list: async (req, res) => {
        const conversations = await messageService.listConversations(req.user.id);

        res.status(200).send({ conversations });
    },

    getOne: async (req, res) => {
        const result = await messageService.getConversation(req.user.id, Number(req.params.id));

        res.status(200).send(result);
    },

    send: async (req, res) => {
        const result = await messageService.sendMessage(req.user.id, Number(req.params.id), req.body.content);

        res.status(201).send(result);
    },

    interest: async (req, res) => {
        const result = await messageService.createInterest(req.user.id, req.body.imageId);

        res.status(result.created ? 201 : 200).send({
            ...result,
            message: result.created ? "Le enviamos tu interes al autor!" : "Ya tenias una conversacion abierta.",
        });
    },

    interestStatus: async (req, res) => {
        const result = await messageService.getInterestStatus(req.user.id, Number(req.params.imageId));

        res.status(200).send(result);
    },
};
