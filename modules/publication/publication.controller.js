const publicationService = require("./publication.service.js");
const userRepository = require("../user/user.repository.js");

module.exports = {
    uploadRenderView: async (req, res) => {
        const author = await userRepository.getProfileById(req.user.id);

        res.render("publication/upload.pug", { author });
    },

    myPublications: async (req, res) => {
        const publications = await publicationService.getUserPublications(req.user.id);

        res.status(200).send({ publications });
    },

    createPublication: async (req, res) => {
        let meta = [];
        try {
            meta = JSON.parse(req.body.meta || "[]");
        } catch {
            meta = [];
        }

        const publication = await publicationService.createPublication(
            req.user.id,
            { title: req.body.title, description: req.body.description, tags: req.body.tags },
            req.files,
            meta
        );

        res.status(201).send({ id: publication.id, message: "Publicacion creada!" });
    },
};
