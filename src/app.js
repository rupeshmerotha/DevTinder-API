const express = require("express")
const app = express()
const connectDB = require("./config/database")
app.use(express.json())
const cookieParser = require("cookie-parser")
app.use(cookieParser())
const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter= require("./routes/request")

app.use("/", authRouter);
app.use("/",profileRouter)
app.use("/",requestRouter)













connectDB().then(()=>{
    console.log("Database Connected Successfully")
    app.listen(3000, ()=>{
        console.log("Server on port 3000 listening...");
    })
}).catch((err)=>{
    console.error("Database Connection Failed");
})
