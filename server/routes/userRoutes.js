const express = require("express");
const router = express.Router();
const jwtMiddleware = require("../middlewares/jwtMiddleware");
const { registerUser, loginUser } = require("../controllers/userControllers");

const {
    registerUser,
    loginUser
}=require("../controllers/userControllers");
router.post("/" , registerUser);
router.post("/login", loginUser,jwtMiddleware);
module.exports=router;