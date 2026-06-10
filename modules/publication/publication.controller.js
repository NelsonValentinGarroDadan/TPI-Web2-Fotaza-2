const publicationService = require("./publication.service.js");
const userRepository = require("../user/user.repository.js");

module.exports = {
    uploadRenderView: async (req, res) => {
        const author = await userRepository.getProfileById(req.user.id);

        res.render("publication/upload.pug", { author, mode: "create", publication: null });
    },

    editRenderView: async (req, res) => {
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) return res.redirect("/profile");

        const [author, publication] = await Promise.all([
            userRepository.getProfileById(req.user.id),
            publicationService.getPublicationForEdit(id, req.user.id),
        ]);

        if (!publication.canEdit) return res.redirect("/profile");

        res.render("publication/upload.pug", { author, mode: "edit", publication });
    },

    updatePublication: async (req, res) => {
        let meta = [];
        try {
            meta = JSON.parse(req.body.meta || "[]");
        } catch {
            meta = [];
        }

        const result = await publicationService.updatePublication(
            Number(req.params.id),
            req.user.id,
            { title: req.body.title, description: req.body.description, tags: req.body.tags },
            req.files,
            meta
        );

        res.status(200).send({ id: result.id, message: "Publicacion actualizada!" });
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

    ratePublication: async (req, res) => {
        const result = await publicationService.rate(
            Number(req.params.id),
            req.user.id,
            req.body.score
        );

        res.status(201).send({ ...result, message: "Calificacion registrada!" });
    },
};
