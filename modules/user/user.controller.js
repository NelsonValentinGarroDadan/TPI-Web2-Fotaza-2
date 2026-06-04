const userService = require("./user.service.js");

module.exports = {
    profileRenderView: async (req, res) => {
        if (!req.user) return res.redirect("/autentication/login");

        const profile = await userService.getProfile(req.user.id);

        res.render("user/profile.pug", { profile });
    },

    updateProfile: async (req, res) => {
        const profile = await userService.updateProfile(req.user.id, {
            ...req.body,
            profile_img : req.file?.path,
        });

        res.status(200).send({ profile, message: "Perfil actualizado!" });
    },
};
