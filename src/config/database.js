const mongoose = require("mongoose");

const connectDB = async()=>{
  await mongoose.connect("mongodb+srv://manishabhaik1:er8WmUjPksoWj3KN@cluster0.m6r4u.mongodb.net/devTinder");
}

module.exports = connectDB
