const express = require("express");

const app = express();



app.use("/test",(req,res)=>{ // callback function is called request handler
    res.send("test");
})

app.use("/hello",(req,res)=>{
    res.send("hello");
})

app.get('/ab?cd', (req, res) => {
    res.send('ab?cd')
  })
  app.get('/ab+cd', (req, res) => {
    res.send('ab+cd')
  })
  app.get('/ab*cd', (req, res) => {
    res.send('ab*cd')
  })
  app.get('/ab(cd)?e', (req, res) => {
    res.send('ab(cd)?e')
  })
  app.get(/a/, (req, res) => {
    res.send('/a/')
  })
  app.get(/.*fly$/, (req, res) => {
    res.send('fly')
  })
//   app.use("/user",(req,res)=>{
//     res.send(req.query);
//   })
app.use("/user/:userId/:bookId",(req,res)=>{
    //res.send("request params");
    res.send(req.params);
})
  app.use("/",(req,res)=>{
    res.send("namaste Manisha");
})
app.listen(3001,()=>{
    console.log("server is running successfully!");
})