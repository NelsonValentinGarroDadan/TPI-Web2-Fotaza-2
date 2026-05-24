const AppError = require("../../errors/appError")
const authService = require("./auth.service.js")
module.exports = {
    login: (req, res) => {
        throw new AppError(400, "No tengo ganas de contestarte")
    },

    register: (req, res) => {
        
        const { nickname } = req.body;

        authService.register(nickname);

        res.status(200).send({ message: "Registro exitoso!"});
    }
}