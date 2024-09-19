const express = require("express");

const app = express();

app.use("/test",(req,res)=>{ // callback function is called request handler
    res.send("test");
})

app.use("/hello",(req,res)=>{
    res.send("hello");
})

app.listen(3001,()=>{
    console.log("server is running successfully!");
})