const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth} = require("./middlewares/auth");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    // validate input data
    validateSignUpData(req);

    // becrypt password
    const {
      firstName,
      lastName,
      emailId,
      password,
      gender,
      age,
      about,
      skills,
    } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const userData = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      gender,
      age,
      about,
      skills,
    });
    await userData.save();
    res.send("User Added Sucessfully !");
  } catch (err) {
    res.status(400).send("Error saving the user :" + err.message);
  }
});

app.post("/login",async(req,res)=>{
  try {
    const {emailId, password} = req.body;
    
    // check for user is present or not
    const user = await User.findOne({emailId:emailId},'password') 
    if(!user){
      throw new Error("Invalid credentials")
    }
    // compare password
    const isPasswordvalid = await bcrypt.compare(password,user.password);
    if(!isPasswordvalid){
      throw new Error("Invalid credentials")
    }else{
      // create jwt token
      const token = await jwt.sign({_id:user._id},"Dev@Tinder1234",{expiresIn:"7d"});
     
      res.cookie("token",token,{expires:new Date(Date.now() + 8 * 3600000)});

      res.status(200).send("Login Successfully !")
    }
    
  } catch (err) {
    res.status(500).send("ERROR "+err.message);
  }
})

app.get("/profile",userAuth,async(req,res)=>{
  try{
    res.status(200).send(req.user);
  }catch(err){
    res.status(500).send("Error "+err.message);
  }
})

app.post("/sentConnectionRequest",userAuth,(req,res)=>{
  try{
    const user = req.user;
    res.status(200).send(user.firstName + " sent you a connection request !")
  }catch(err){
    res.status(500).send("Error "+ err.message);
  }
})

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

app.get("/feed", async (req, res) => {
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

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    // await User.findOneAndDelete({_id:userId})
    const user = await User.findByIdAndDelete(userId);
    if (user.length === 0) {
      res.status(400).send("Feed data Not Found!");
    } else {
      res.status(200).send("User Deleted Successfully !");
    }
  } catch (err) {
    res.status(500).send("Something went wrong !");
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const userData = req.body;

  try {
    const AllowedUpdates = ["photoUrl", "age", "gender", "skills", "about"];

    const isUpdateAllowed = Object.keys(userData).every((k) =>
      AllowedUpdates.includes(k)
    );

    if (!isUpdateAllowed) {
      throw new Error("Updates not allowed !");
    }

    const user = await User.findByIdAndUpdate({ _id: userId }, userData, {
      new: true, // Return the updated document
      runValidators: true, // Enable validation on update
    });
    if (user.length === 0) {
      res.status(400).send("data Not Found!");
    } else {
      res.status(200).send("User Updated Successfully !");
    }
  } catch (err) {
    res.status(500).send("Something went wrong !" + err.message);
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
