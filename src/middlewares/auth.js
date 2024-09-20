const adminAuth = (req,res,next)=>{
    const isAuthorized = true;
    if (!isAuthorized) {
      res.status(500).send("unauthorized user");
    } else {
     next();
    }
  }

  const userAuth = (req,res,next)=>{
    const isAuthorized = false;
    if (!isAuthorized) {
      res.status(500).send("unauthorized user");
    } else {
     next();
    }
  }
  module.exports = {
    adminAuth,
    userAuth
  }