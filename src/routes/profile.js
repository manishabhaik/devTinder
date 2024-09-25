const express = require("express");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const { validateProfileAllowedData } = require("../utils/validation");
const bcrypt = require("bcrypt");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(500).send("ERROR " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const isEditAllowed = await validateProfileAllowedData(req);

    if (isEditAllowed) {
      const loggedInUser = req.user;

      // update
      Object.keys(req.body).forEach(
        (key) => (loggedInUser[key] = req.body[key])
      );

      loggedInUser.save();

      res
        .status(200)
        .json({
          message: `${loggedInUser.firstName}, your profile Update successfully`,
          data: loggedInUser,
        });
    } else {
      throw new Error("Invalid Edit Request");
    }
  } catch (err) {
    res.status(500).send("ERROR " + err.message);
  }
});

profileRouter.post("/profile/password", userAuth, async (req, res) => {
  try {
    const { newPassword, confirmNewPassword } = req.body;
    const user = req.user;
    
    // Check if new password and confirm password match
    if (newPassword !== confirmNewPassword) {
      throw new Error("New password and confirmation do not match");
    }
    // Check if the current password is correct if provide in api
    // const isMatch = await bcrypt.compare(currentPassword, user.password);
    // if (!isMatch) {
    //     throw new Error('Current password is incorrect');
    // }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedNewPassword;

    await user.save();

    res.send("Password changed successfully");
  } catch (err) {
    res.status(500).send("ERROR " + err.message);
  }
});

//   profileRouter.delete("/user", async (req, res) => {
//     const userId = req.body.userId;
//     try {
//       // await User.findOneAndDelete({_id:userId})
//       const user = await User.findByIdAndDelete(userId);
//       if (user.length === 0) {
//         res.status(400).send("Feed data Not Found!");
//       } else {
//         res.status(200).send("User Deleted Successfully !");
//       }
//     } catch (err) {
//       res.status(500).send("ERROR "+ err.message);
//     }
//   });

//   profileRouter.patch("/user/:userId", async (req, res) => {
//     const userId = req.params?.userId;
//     const userData = req.body;

//     try {
//       const AllowedUpdates = ["photoUrl", "age", "gender", "skills", "about"];

//       const isUpdateAllowed = Object.keys(userData).every((k) =>
//         AllowedUpdates.includes(k)
//       );

//       if (!isUpdateAllowed) {
//         throw new Error("Updates not allowed !");
//       }

//       const user = await User.findByIdAndUpdate({ _id: userId }, userData, {
//         new: true, // Return the updated document
//         runValidators: true, // Enable validation on update
//       });
//       if (user.length === 0) {
//         res.status(400).send("data Not Found!");
//       } else {
//         res.status(200).send("User Updated Successfully !");
//       }
//     } catch (err) {
//       res.status(500).send("Something went wrong !" + err.message);
//     }
//   });

module.exports = profileRouter;
