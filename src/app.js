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
  try {
    await userData.save();
    res.send("User Added Sucessfully !");
  } catch (err) {
    res.status(400).send("Error saving the user :" + err.message);
  }
});

app.get("/user", async (req, res) => {
  try {
    const userEmailId = req.body.emailId;
    const users = await User.find({ emailId: userEmailId });
    if (users.length === 0) {
      res.status(400).send("User Not Found!");
    } else {
      res.status(200).send(users);
    }
  } catch (err) {
    res.status(500).send("Something went wrong !");
  }
});

app.get("/feed", async(req, res) => {
  try {
    const allUsers = await User.find({});
    if (allUsers.length === 0) {
      res.status(400).send("Feed data Not Found!");
    } else {
      res.status(200).send(allUsers);
    }
  } catch (err) {
    res.status(500).send("Something went wrong !");
  }
});

app.delete("/user",async(req,res)=>{
  const userId = req.body.userId;
try {
  // await User.findOneAndDelete({_id:userId})
  const user = await User.findByIdAndDelete(userId);
  if(user.length ===0){
    res.status(400).send("Feed data Not Found!");
  }else{
    res.status(200).send("User Deleted Successfully !")
  }
} catch (err) {
  res.status(500).send("Something went wrong !");
}
})

app.patch("/user",async(req,res)=>{
  const userId = req.body.userId;
  const userData = req.body;
  try {
    const user = await User.findByIdAndUpdate({_id:userId}, userData);
    if(user.length ===0){
      res.status(400).send("Feed data Not Found!");
    }else{
      res.status(200).send("User Updated Successfully !")
    }
    
  } catch (err) {
    res.status(500).send("Something went wrong !");
  }
})

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
