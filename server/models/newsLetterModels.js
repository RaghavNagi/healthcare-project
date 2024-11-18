const mongoose = require("mongoose");

const newsLetterSchema = new mongoose.Schema({
    title:{
        type:String,
        require:[true, "please fill this field"],
    },
    author:{
        type:String,
        require:[true, "please fill the field"]
    },
    date:{
        type:Date,
        require:[true,"please fill the field"]
    },
    description:{
        type:String,
        require:[true,"please fill the field"]
    },
    imageUrl:{
        type:String,
        require:[true,"please fill the field"]
    }},{
        timestamps:true}
);

const newsLetter = mongoose.model("NewsLetter",newsLetterSchema);

module.exports = newsLetter;