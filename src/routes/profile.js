const express = require("express")
const userAuth = require("../middleware/auth")
const User = require("../models/user")
const connectionRequest = require("../models/connectionRequest")
const profileRouter = express.Router()

profileRouter.get("/profile/view", userAuth , async (req,res)=>{
    try{
        const user = await User.findById(req._id)
        return res.json(user);
    }
    catch(err){
        res.status(400).send("Unable to fetch your profile")
    }
    
})

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const data = req.body;
    const allowedUpdates = ["firstName","lastName","skills","about","photoUrl","age","password"];
    const isUpdateAllowed = Object.keys(data).every((k) =>allowedUpdates.includes(k));

    if (!isUpdateAllowed) {
      return res.status(400).send("Updating emailId or adding random fields is not allowed");
    }
    const updatedUser = await User.findByIdAndUpdate(req._id, data);
    res.send( updatedUser.firstName + "'s data updated successfully");
  } catch (err) {
    res.status(400).send("Unable to update user data");
  }
});

profileRouter.get("/profile/all", userAuth, async (req,res)=>{
    try {
    const loggedInUserId = req._id;
    const connectionRequests = await connectionRequest.find({
      $or: [
        { fromUserId: loggedInUserId },
        { toUserId: loggedInUserId }
      ]
    })

    // 3. Create a set of user IDs to exclude from feed
    const hideUsersFromFeed = new Set();
    hideUsersFromFeed.add(loggedInUserId); // add yourself first

    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId);
      hideUsersFromFeed.add(req.toUserId);
    });

    // 4. Find all users NOT in the excluded set
    const users = await User.find({
      _id: { $nin: Array.from(hideUsersFromFeed) },
    }).select("firstName lastName age gender skills about photoUrl"); // optional: only return needed fields

    // 5. Send response
    res.status(200).json(users);
  } catch (err) {
    console.error("Feed Error: ", err); 
    res.status(500).send("Something went wrong while building your feed.");
  }
    
})



module.exports=profileRouter