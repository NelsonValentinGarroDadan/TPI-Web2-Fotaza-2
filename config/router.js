const {Router} = require('express');
const authRoutes = require('../modules/auth/auth.routes.js');
const userRoutes = require('../modules/user/user.routes.js');
const router = Router();


router.get("/", (req,res)=>{ res.render("home.pug")});
router.use("/autentication", authRoutes);
router.use("/profile", userRoutes);

module.exports =  router;