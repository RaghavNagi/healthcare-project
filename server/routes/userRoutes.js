const express = require("express");
const router = express.Router();
const {validateJwtToken,createToken} = require("../middlewares/jwtMiddleware");
const { registerUser, loginUser } = require("../controllers/userControllers");

router.post("/" , registerUser);
router.post("/login", createToken ,loginUser);
module.exports=router;