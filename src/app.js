const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();

app.post("/signup", async (req, res) => {
  const userData = new User({
    firstName: "Rinku",
    lastName: "Singh",
    emailId: "rinku@gmail.com",
    password: "rinku",
    gender: "male",
    age: 28,
  });

  try{
    await userData.save();
    res.send("User Added Sucessfully !");
  }catch(err){
    res.status(400).send("Error saving the user :"+ err.message);
  }
  
});

connectDB()
  .then(() => {
    console.log("Database connected !");
    app.listen(3001, () => {
      console.log("server is running successfully!");
    });
  })
  .catch((err) => {
    console.error("Database not connected");
  });
