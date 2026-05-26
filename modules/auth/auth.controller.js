const AppError = require("../../errors/appError.js");
const authService = require("./auth.service.js");
const pug = require("pug");
module.exports = {
    login: (req, res) => {
        res.render("auth/login.pug")
    },
    registerRenderView: (req, res) => {
        res.render("auth/register.pug")
    },
    register: async (req, res) => { 

        await authService.register({
            ...req.body,
            profile_img : req.file?.path,
        });

        res.status(200).send({ message: "Registro exitoso!"});
    }
}