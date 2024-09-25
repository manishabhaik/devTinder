const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const {userAuth} = require("../middlewares/auth");
const { validateSignUpData } = require("../utils/validation");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
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

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    // check for user is present or not
    const user = await User.findOne({ emailId: emailId }, "password");
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // compare password
    const isPasswordvalid = await user.validatePassword(password);

    if (!isPasswordvalid) {
      throw new Error("Invalid credentials");
    } else {
      // create jwt token
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });

      res.status(200).send("Login Successfully !");
    }
  } catch (err) {
    res.status(500).send("ERROR " + err.message);
  }
});

authRouter.post("/logout",(req,res)=>{
    try{
        // cleanup logic before logout 
        
        // clear cookie
        res.cookie("token",null,{expires:new Date(Date.now())});
        res.send("Logout Successfull!");
    }catch(err){
        res.status(500).send("ERROR "+ err.message);
    }
})
module.exports = authRouter;
