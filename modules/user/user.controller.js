const userService = require("./user.service.js");
const publicationService = require("../publication/publication.service.js");

module.exports = {
    profileRenderView: async (req, res) => {
        if (!req.user) return res.redirect("/autentication/login");

        const [profile, publications] = await Promise.all([
            userService.getProfile(req.user.id),
            publicationService.getUserPublicationsDetailed(req.user.id),
        ]);

        res.render("user/profile.pug", { profile, publications });
    },

    userProfileRenderView: async (req, res) => {
        const targetId = Number(req.params.id);

        if (!Number.isInteger(targetId) || targetId === req.user.id)
            return res.redirect("/profile");

        const profile = await userService.getPublicProfile(targetId, req.user.id);

        res.render("user/userProfile.pug", { profile });
    },

    follow: async (req, res) => {
        const result = await userService.follow(req.user.id, Number(req.params.id));

        res.status(200).send({ ...result, message: "Ahora seguis a este usuario." });
    },

    unfollow: async (req, res) => {
        const result = await userService.unfollow(req.user.id, Number(req.params.id));

        res.status(200).send({ ...result, message: "Dejaste de seguir a este usuario." });
    },

    updateProfile: async (req, res) => {
        const profile = await userService.updateProfile(req.user.id, {
            ...req.body,
            profile_img : req.file?.path,
        });

        res.status(200).send({ profile, message: "Perfil actualizado!" });
    },
};
