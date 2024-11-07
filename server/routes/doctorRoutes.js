const express = require("express");
const router = express.Router();
const {
    registerDoctor
    // loginUser
}=require("../controllers/doctorDetailControllers");
router.post("/register" , registerDoctor);
module.exports=router;