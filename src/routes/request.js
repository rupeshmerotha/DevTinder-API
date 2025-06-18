const express = require("express")
const userAuth = require("../middleware/auth")
const User = require("../models/user")
const requestRouter = express.Router()
const ConnectionRequest = require("../models/connectionRequest")

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req,res)=>{
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
        const allowedStatuses = ["interested", "ignored"];
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
        };

    res.send(messages[status]);
        
    }
    catch(err){
        res.status(400).send("Unable to send connection request")
    }
    
})

requestRouter.post("/request/review/:status/:fromUserId" , userAuth, async (req,res)=>{
    try{
        const fromUserId= req.params.fromUserId;
        const status = req.params.status
        const loggedInUserId = req._id;

        if(status!=="accepted" && status!=="rejected"){
            return res.status(400).send("Invalid request")
        }

        // 3. Find the connection request (A → B)
        const connection = await ConnectionRequest.findOne({
        fromUserId: fromUserId,
        toUserId: loggedInUserId,
        status: "interested"
        });

        if (!connection) {
        return res.status(404).send("No pending connection request from this user");
        }

        // 4. Update the status
        connection.status = status;
        await connection.save();

        // 5. Get users (for name in response)
        const fromUser = await User.findById(fromUserId);
        const loggedInUser = await User.findById(loggedInUserId);

        if (status === "accepted") {
        return res.send(`${loggedInUser.firstName} accepted the connection request from ${fromUser.firstName}`);
        } else {
        return res.send(`${loggedInUser.firstName} rejected the connection request from ${fromUser.firstName}`);
        }
 
    }
    catch(err){
        res.status(400).send("Error while reviewing request")
    }

})



module.exports=requestRouter