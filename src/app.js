const express = require("express");

const app = express();

const {adminAuth,userAuth} =require("./middlewares/auth");

app.use("/admin",adminAuth);

app.use("/admin/getAllUser", (req, res) => {
    res.send("all user data");
});
app.use("/admin/deleteUser", (req, res) => {
  res.send("user deleted successfully!");
});

app.use("/user/login",(req,res)=>{
  res.send("user loggedin successfully!")
})

// app.use("/user",userAuth,(req,res)=>{
//     res.send("user data")
// })

// error handlers



app.use("/user/list",(req,res)=>{
  // try{
    throw new Error("fsdfsgsdg");
    res.send("user list data")
  // }catch(err){
  //   res.status(500).send("contact support team")
  // }
})

app.use("/",(err,req,res,next)=>{
  if(err){
    res.status(500).send("something went wrong!")
  }
})

app.listen(3001, () => {
  console.log("server is running successfully!");
});
