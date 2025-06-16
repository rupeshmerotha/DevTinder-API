const express = require("express")
const app = express()


app.listen(3000, ()=>{
    console.log("server listening on port 3000");
    
})

app.get("/user", (req,res)=>{
    res.send({
        firstName: "rupesh",
        lastName: "merotha",
        age: 20
    })
})

app.get("/user/:userId", (req,res)=>{
    res.send("data of " + req.params.userId+ " is fetched")
})



app.patch("/user", (req,res)=>{
    res.send({
        firstName: "rupesh sir",
        age: 23
    })
})
