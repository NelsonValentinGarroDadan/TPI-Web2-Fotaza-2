const requireAuthPage = (reason = "auth", redirectTo = "/autentication/login") => (req, res, next) => {
    if (!req.user) return res.redirect(`${redirectTo}?reason=${reason}`);
    next();
};

module.exports = requireAuthPage;
