const express = require("express")
const userAuth = require("../middleware/auth")
const User = require("../models/user")
const requestRouter = express.Router()
const ConnectionRequest = require("../models/connectionRequest")

requestRouter.post("/request/:status/:toUserId", userAuth, async (req,res)=>{
    try{
        // userAuth logged in user ko req me bheja matlab,
        const fromUserId = req._id; 
        const toUserId = req.params.toUserId;
        const status = req.params.status   
        
        // logged in user cant sent request to himself
        if (fromUserId === toUserId) {
            return res.status(400).send("You can't send request to yourself");
        }

        // ✅ Validate status
        const allowedStatuses = ["interested", "ignored", "accepted", "rejected"];
        if (!allowedStatuses.includes(status)) {
        return res.status(400).send("Invalid request status.");
        }

        // ✅ Fetch users
        const fromUser = await User.findById(fromUserId);
        const toUser = await User.findById(toUserId);

        if (!fromUser || !toUser) {
            return res.status(404).send("User not found.");
        }

        // re sending the request to same person should not be allowed
        const existing = await ConnectionRequest.findOne({ fromUserId, toUserId, status: "interested" });
        if (existing) {
        return res.status(409).send("Request already sent");
        }

        // if a->b is already in db , and we are here doing b->a 
        // checking if reverse exist
        const oppositeRequest= await ConnectionRequest.findOne({fromUserId: toUserId , toUserId:fromUserId, status:"interested"})
        // if exists then update the status to accepted and send response as matched
        if(oppositeRequest){
            oppositeRequest.status="accepted"
            await oppositeRequest.save();
            return res.send("Its a Match: " + fromUser.firstName + " and "+toUser.firstName)
        }

        

        const newRequest = new ConnectionRequest({
            fromUserId, toUserId, status
        })

        await newRequest.save();

        // ✅ Prepare response message
        const messages = {
            interested: `${fromUser.firstName} sent request to ${toUser.firstName}`,
            ignored: `${fromUser.firstName} ignored the request of ${toUser.firstName}`,
            accepted: `${fromUser.firstName} accepted the request of ${toUser.firstName}`,
            rejected: `${fromUser.firstName} rejected the request of ${toUser.firstName}`,
        };

    res.send(messages[status]);
        
    }
    catch(err){
        res.status(400).send("Unable to send connection request")
    }
    
})



module.exports=requestRouter