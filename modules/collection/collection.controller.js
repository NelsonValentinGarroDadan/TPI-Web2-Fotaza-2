const collectionService = require("./collection.service.js");

module.exports = {
    list: async (req, res) => {
        const collections = await collectionService.getCollectionsForPicker(req.user.id, req.query.publicationId);

        res.status(200).send({ collections });
    },

    create: async (req, res) => {
        const collection = await collectionService.createCollection(req.user.id, req.body.name);

        res.status(201).send({ collection, message: "Coleccion creada!" });
    },

    remove: async (req, res) => {
        await collectionService.deleteCollection(req.user.id, Number(req.params.id));

        res.status(200).send({ message: "Coleccion eliminada." });
    },

    addPublication: async (req, res) => {
        const result = await collectionService.addPublication(
            req.user.id,
            Number(req.params.id),
            Number(req.body.publicationId)
        );

        res.status(201).send({ ...result, message: "Guardado en la coleccion!" });
    },

    removePublication: async (req, res) => {
        const result = await collectionService.removePublication(
            req.user.id,
            Number(req.params.id),
            Number(req.params.publicationId)
        );

        res.status(200).send({ ...result, message: "Quitado de la coleccion." });
    },
};
