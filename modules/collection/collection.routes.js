const { Router } = require('express');
const collectionController = require('./collection.controller');
const requireAuth = require('../../middlewares/requireAuth');
const ValidatorHandler = require('../../middlewares/validatorHandler');
const { createCollectionDTO, addPublicationDTO } = require('./collection.dto');
const collectionRoutes = Router();

collectionRoutes.use(requireAuth());

collectionRoutes.get("/",collectionController.list);

collectionRoutes.post("/",ValidatorHandler(createCollectionDTO), collectionController.create);

collectionRoutes.delete("/:id", collectionController.remove);

collectionRoutes.post("/:id/publications", ValidatorHandler(addPublicationDTO), collectionController.addPublication);

collectionRoutes.delete("/:id/publications/:publicationId", collectionController.removePublication);

module.exports = collectionRoutes;
