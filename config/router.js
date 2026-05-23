const {Router} = require('express');
const { response } = require('./server');

const router = Router();

router.get("/", (req,res)=>{ res.send("hola")});

module.exports =  router;