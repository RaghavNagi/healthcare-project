const express = require("express");
const router = express.Router();
const {validateJwtToken,createToken} = require("../middlewares/jwtMiddleware");
const userControllers = require("../controllers/userControllers");

router.post("/register" , userControllers.registerUser);
router.post("/login", userControllers.loginUser);
module.exports=router;