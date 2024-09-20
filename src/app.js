const express = require("express");

const app = express();

app.use("/hi", (req, res) => {
  res.res("hi response");
  console.log("hi"); // it goes in infinte loop. we need to send response
});

app.use("/", (req, res,next) => { // middleware
    console.log("hi");
    next();
  });

app.use(
  "/user",
  (req, res,next) => { // middleware
    
    console.log("handling user request 1");
    next();
    // res.send("1st response");
    
  },
  [(req, res,next) => { // middleware
    console.log("handling user request 2");
    // res.send("2st response");
    next();
  },
  (req, res,next) => { // middleware
    console.log("handling user request 3");
    // res.send("3st response");
    next();
  }],
  (req, res,next) => {  // request handler
    console.log("handling user request 4");
    // res.send("4st response");
    next(); // error because next rout not found
     res.send("4st response");  
  }
);

// or we can write like below
app.use(
    "/user",
    (req, res,next) => {
      
      console.log("handling user request 1");
      next();
      // res.send("1st response");
    });

    app.use(
        "/user",
        (req, res,next) => {
          console.log("handling user request 2");
          res.send("2st response");
        //   next();
        });

app.listen(3001, () => {
  console.log("server is running successfully!");
});
