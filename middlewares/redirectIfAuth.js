const redirectIfAuth = (redirectTo = "/") => (req, res, next) => {
    if (req.user) {
        return res.redirect(req.user.is_admin ? "/dashboar-admin" : redirectTo);
    }
    next();
};

module.exports = redirectIfAuth;
