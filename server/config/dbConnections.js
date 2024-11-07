const mongoose = require("mongoose");

const connectDB = async() => {
  try {
    const connect = await mongoose.connect(process.env.CONNECTION_STRING);
    console.log(`mongodb connection successful || HOST ${connect.connection.host}`);
  }
  catch(error){
    console.log("mongodb connection failed",error);
    process.exit(1);
  }
}

module.exports = connectDB;