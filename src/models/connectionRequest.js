const mongoose = require("mongoose");

const connectionRequestSchema = mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required:true
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required:true
  },
  status: {
    type: String,
    enum: {
      values: ["ignored", "interested", "accepted", "rejected"],
      message: "{VALUE} is not supported",
    },
    required:true
  },
},{timeStamps:true});

// compund index
connectionRequestSchema.index({fromUserId:1,toUserId:1});

// middleware
connectionRequestSchema.pre("save",function(next){
  const connectionRequest = this;
  // check if from user is is same as to user id
  if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
    throw new Error("Can not send connection request to yourself")
  }
  next();
})

const connectionRequest = new mongoose.model("connectionRequest",connectionRequestSchema);
module.exports = connectionRequest;