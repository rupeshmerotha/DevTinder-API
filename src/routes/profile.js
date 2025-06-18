const express = require("express")
const userAuth = require("../middleware/auth")
const User = require("../models/user")
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
    try{
        const allUsers = await User.find()
        res.send(allUsers)
    }
    catch(err){
        res.status(400).send("Unable to get users")
    }
    
})



module.exports=profileRouter