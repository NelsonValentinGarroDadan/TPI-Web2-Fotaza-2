const AppError = require("../../errors/appError.js");
const authService = require("./auth.service.js");
const pug = require("pug");
module.exports = {
    login: (req, res) => {
        res.render("auth/register.pug")
    },

    register: (req, res) => {
        
        const { nickname } = req.body;

        authService.register(nickname);

        res.status(200).send({ message: "Registro exitoso!"});
    }
}