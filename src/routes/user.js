const express = require("express");

const userRouter = express.Router();

userRouter.get("/feed", async (req, res) => {
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
  

//   userRouter.get("/user", async (req, res) => {
//     try {
//       const userEmailId = req.body.emailId;
//       const users = await User.find({ emailId: userEmailId });
//       if (users.length === 0) {
//         res.status(400).send("User Not Found!");
//       } else {
//         res.status(200).send(users);
//       }
//     } catch (err) {
//       res.status(500).send("Something went wrong !");
//     }
//   });
module.exports = userRouter;