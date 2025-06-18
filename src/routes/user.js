const express = require("express")
const userAuth = require("../middleware/auth")
const User = require("../models/user")
const userRouter = express.Router()
const ConnectionRequest = require("../models/connectionRequest")

userRouter.get("/connections", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req._id;
    
    // Populate toUserId to get details of users you sent requests to
    const sentRequests = await ConnectionRequest.find({ 
      fromUserId: loggedInUserId 
    }).populate("toUserId", "firstName lastName age gender about skills photoUrl");
    console.log(sentRequests);
    
    return res.status(200).json(sentRequests);
  }
  catch (err) {
    console.error("Error fetching sent connection requests:", err);
    return res.status(500).send("Error fetching sent connection requests");
  }
});

userRouter.get("/requests", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req._id;
    
    // Populate fromUserId to get details of users who sent requests to you
    const comingRequests = await ConnectionRequest.find({ 
      toUserId: loggedInUserId 
    }).populate("fromUserId", "firstName lastName age gender about skills photoUrl");
    
    return res.status(200).json(comingRequests);
  }
  catch (err) {
    console.error("Error fetching incoming connection requests:", err);
    return res.status(500).send("Error fetching incoming connection requests");
  }
});



module.exports = userRouter