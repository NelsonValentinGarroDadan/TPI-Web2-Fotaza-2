const AppError = require("../errors/appError");

const RequiredAuth = (req, res, next) => {
    if(!req.user) throw new AppError(401, "Usuario no autenticado");
    next();
}