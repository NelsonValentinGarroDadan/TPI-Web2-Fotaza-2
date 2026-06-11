const collectionRepository = require("./collection.repository");
const publicationRepository = require("../publication/publication.repository");
const { shapePublication } = require("../publication/publication.service");
const userRepository = require("../user/user.repository");
const AppError = require("../../errors/appError");

module.exports = {
    getUserCollections: async (userId) => {
        const collections = await collectionRepository.getCollectionsByUser(userId);
        const followingSet = new Set(await userRepository.getFollowingIds(userId));

        const allIds = [
            ...new Set(collections.flatMap((c) => (c.publications || []).map((p) => p.id))),
        ];
        const fullPubs = await publicationRepository.getPublicationsByIds(allIds);

        const shapedById = new Map();
        fullPubs.forEach((p) => {
            const shaped = shapePublication(p, { viewerId: userId, withAuthor: true, followingIds: followingSet });
            if (shaped) shapedById.set(p.id, shaped);
        });

        return collections.map((c) => {
            const publications = (c.publications || [])
                .map((p) => shapedById.get(p.id))
                .filter(Boolean);

            return {
                id: c.id,
                name: c.name,
                count: publications.length,
                cover: publications[0]?.cover || null,
                publications,
            };
        });
    },

    getCollectionsForPicker: async (userId, publicationId) => {
        const collections = await collectionRepository.getCollectionsByUser(userId);
        const pid = Number(publicationId);

        return collections.map((c) => ({
            id: c.id,
            name: c.name,
            saved: Number.isInteger(pid) ? (c.publications || []).some((p) => p.id === pid) : false,
        }));
    },

    createCollection: async (userId, name) => {
        const trimmed = (name || "").trim();
        if (!trimmed) throw new AppError(400, "El nombre de la coleccion es obligatorio.");
        if (trimmed.length > 50) throw new AppError(400, "El nombre no puede tener mas de 50 caracteres.");

        const existing = await collectionRepository.findByName(userId, trimmed);
        if (existing) throw new AppError(409, "Ya tenes una coleccion con ese nombre.");

        const collection = await collectionRepository.createCollection({ user_id: userId, name: trimmed });

        return { id: collection.id, name: collection.name, count: 0 };
    },

    deleteCollection: async (userId, id) => {
        const collection = await collectionRepository.findOwned(id, userId);
        if (!collection) throw new AppError(404, "Coleccion no encontrada.");

        await collectionRepository.deleteCollection(id);
    },

    addPublication: async (userId, collectionId, publicationId) => {
        const collection = await collectionRepository.findOwned(collectionId, userId);
        if (!collection) throw new AppError(404, "Coleccion no encontrada.");

        const publication = await publicationRepository.getPublicationById(publicationId);
        if (!publication || publication.deleted) throw new AppError(404, "Publicacion no encontrada.");

        const already = await collection.hasPublication(publicationId);
        if (already) throw new AppError(409, "La publicacion ya esta en esta coleccion.");

        await collection.addPublication(publicationId);

        return { collectionId: collection.id, publicationId };
    },

    removePublication: async (userId, collectionId, publicationId) => {
        const collection = await collectionRepository.findOwned(collectionId, userId);
        if (!collection) throw new AppError(404, "Coleccion no encontrada.");

        await collection.removePublication(publicationId);

        return { collectionId: collection.id, publicationId };
    },
};
