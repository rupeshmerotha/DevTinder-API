const express = require("express")
const app = express()


app.listen(3000, ()=>{
    console.log("server listening on port 3000");
    
})

app.use((req,res)=>{
    res.send("welcome to the first server of devtinder")
})