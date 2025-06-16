const mongoose = require("mongoose")

const connectDB = async ()=>{
    await mongoose.connect(
        "mongodb+srv://rupeshmerotha2004:rupeshdb123@namastenode.c5t0yyc.mongodb.net/devTinder"
    )
}
module.exports= connectDB