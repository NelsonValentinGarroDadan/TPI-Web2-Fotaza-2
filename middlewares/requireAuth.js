const AppError = require("../errors/appError");

const requireAuth = (role) => (req, res, next) => {
    if (!req.user) throw new AppError(401, "Usuario no autenticado");
    if (role === "admin" && !req.user.is_admin) throw new AppError(403, "Acceso restringido.");
    next();
};

module.exports = requireAuth;
