const { verify } = require("../config/jwt");

const AuthHandler = (req, res, next) => {
    const token = req.cookies?.token;
    if (token) {
          try {
              const payload = verify(token);
              req.user = payload;
          } catch { }
    }
    next();
};

module.exports = AuthHandler;