const express = require("express")
const userAuth = require("../middleware/auth")
const User = require("../models/user")
const requestRouter = express.Router()

requestRouter.post("/connectionRequest/:userId", userAuth, async (req,res)=>{
    try{
        const toUser = await User.findById(req.params.userId)
        const fromUser = await User.findById(req._id)
        res.send(fromUser.firstName + " sent connection request to " + toUser.firstName)
    }
    catch(err){
        res.status(400).send("Unable to send connection request")
    }
    
})



module.exports=requestRouter