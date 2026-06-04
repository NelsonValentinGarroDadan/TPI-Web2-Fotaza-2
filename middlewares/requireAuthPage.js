const requireAuthPage = (redirectTo = "/autentication/login",reason) => (req, res, next) => {
    if (!req.user) return res.redirect(`${redirectTo}?reason=${reason}`);
    next();
};

module.exports = requireAuthPage;
