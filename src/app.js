const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const userRouter = require("./routes/user");
const requestRouter = require("./routes/request");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", userRouter);
app.use("/", requestRouter);

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
