const express = require("express");
const {userAuth} = require("../middlewares/auth");
const connectionRequest = require("../models/connectionRequest");
const requestRouter = express.Router();
const User = require("../models/user")
requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{
    try{
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const allowedStatus = ["ignored","interested"];
     
      // check if from user is is same as to user id (this can be handle in db schema level too using pre schema middleware)
    //   if(fromUserId !== toUserId){
    //     return res.status(500).json({message:"Can not send connection request to yourself"})
    //   }
      // check for status validation
      if(!allowedStatus.includes(status)){
        return res.status(500).json({message:"Invalid Status type "+status})
      }

      // check for  toUserId is real User
      const toUser = await User.findById(toUserId)
     
      if(!toUser){
        return res.status(404).json({message:"User not found!"})
      }

      // check for existing connection request
      const existingConnectionRequest = await connectionRequest.findOne({
        $or:[
            {fromUserId,toUserId},
            {fromUserId:toUserId , toUserId:fromUserId}
        ]
      })
      if(existingConnectionRequest){
        return res.status(400).json({message:"Connection Request already send"})
      }
      
      const connectionData = new connectionRequest({
        fromUserId,
        toUserId,
        status
      })

      await connectionData.save();

      res.status(200).json({message:`${req.user.firstName} is ${status} in ${toUser.firstName}`});

    }catch(err){
      res.status(500).send("Error "+ err.message);
    }
  })

module.exports = requestRouter;