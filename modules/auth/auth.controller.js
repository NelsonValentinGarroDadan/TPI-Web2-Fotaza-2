const AppError = require("../../errors/appError.js");
const authService = require("./auth.service.js");

module.exports = {
    loginRednderView: (req, res) => {
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
    },
    login: async (req, res) => {
        const {token, user }= await authService.login(req.body);

        res.cookie('token', token, {
            httpOnly: true,           
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',         
            maxAge: 24 * 60 * 60 * 1000, 
        });

        res.status(200).send({ user, message: "Inicio de sesion exitoso!"})
    },
    logout: (req, res) => {
        res.clearCookie('token', { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' 
        });
        res.status(200).send({ message: "Cierre de sesion exitoso!"});
    },
}