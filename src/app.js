const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();

app.use(express.json()); 

app.post("/signup", async (req, res) => {
   
  // const userData = new User({
  //   firstName: req.body.firstName,
  //   lastName: req.body.lastName,
  //   emailId: req.body.emailId,
  //   password: req.body.password,
  //   gender: req.body.gender,
  //   age: req.body.age,
  // });
  
  const userData = new User(req.body);
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
