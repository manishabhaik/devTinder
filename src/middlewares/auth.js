const jwt = require("jsonwebtoken");
const User = require("../models/user");


const userAuth = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const token = cookies.token;
    if (!token) {
      throw new Error("Invalid Token");
    }
    const decodedMessage = await jwt.verify(token, "Dev@Tinder1234");
    const userId = decodedMessage._id;

    // fetch user data from db and attach to req
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User data not found !");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(500).send("Error " + err.message);
  }
};
module.exports = {
  userAuth,
};
