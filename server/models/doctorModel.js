const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: {
    type:String,
    require:[true, "please fill this field"],
  },

  email: {
    type:String,
    require:[true, "please fill this field"],
  },
  speciality:{
    type:String,
    require:[true, "please fill the field"],
  },
  phoneNumber:{
    type:String,
    require:[true, "please fill the field"],
  },
  experience: {
    type:String,
    require:[true, "please fill the field"],
  },
  address:{
    type:String,
    require:[true,"please fill the field"],
  }
},{
  timestamps : true}
);

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;