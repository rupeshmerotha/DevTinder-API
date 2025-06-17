const express = require("express")
const app = express()
const {adminAuth} = require("./middleware/auth")
const connectDB = require("./config/database")
const User = require("./models/user")

app.use(express.json())

app.post("/signup", async (req,res)=>{
    try{
        const user = new User(req.body);
        await user.save();
        res.send(user.firstName + " Signed Up Successfully")
    }
    catch(err){
        res.status(400).send("Unable to add new user")
    }
    
})

app.get("/feed", async (req,res)=>{
    try{
        const allUsers = await User.find()
        res.send(allUsers)
    }
    catch(err){
        res.status(400).send("Unable to get users")
    }
    
})

app.delete("/user", async (req,res)=>{
    try{
        const userId= req.body._id
        const users = await User.findByIdAndDelete(userId)
        res.send("User deleted Successfully")
    }
    catch(err){
        res.status(400).send("Unable to delete users")
    }
    
})

app.patch("/user", async (req,res)=>{
    try{
        const userId= req.body._id
        const data = req.body
        const user = await User.findByIdAndUpdate(userId,data)
        res.send("User data updated Successfully")
    }
    catch(err){
        res.status(400).send("Unable to update user data")
    }
    
})





connectDB().then(()=>{
    console.log("Database Connected Successfully")
    app.listen(3000, ()=>{
        console.log("Server on port 3000 listening...");
    })
}).catch((err)=>{
    console.error("Database Connection Failed");
})
