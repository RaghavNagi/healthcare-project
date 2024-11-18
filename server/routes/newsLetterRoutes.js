const express = require("express");
const router = express.Router();
const {
    registerNewsLetter,getNewsletter,updateNewsletter,deleteNewsletter
}=require("../controllers/newsLetterController");
router.post("/" , registerNewsLetter);
router.get("/" , getNewsletter);
router.put("/" , updateNewsletter);
router.delete("/" , deleteNewsletter);
module.exports=router;