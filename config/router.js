const {Router} = require('express'); 
const authRoutes = require('../modules/auth/auth.routes.js');
const router = Router();


router.get("/", (req,res)=>{ res.render("home.pug")});
router.use("/autentication", authRoutes);

module.exports =  router;