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





connectDB().then(()=>{
    console.log("Database Connected Successfully")
    app.listen(3000, ()=>{
        console.log("Server on port 3000 listening...");
    })
}).catch((err)=>{
    console.error("Database Connection Failed");
})
