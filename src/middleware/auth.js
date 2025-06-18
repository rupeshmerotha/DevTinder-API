const jwt = require("jsonwebtoken")

const userAuth = (req,res,next)=>{
    try{

        const token = req.cookies.token
        if (!token) {
            return res.status(401).send("No token, authorization denied");
        }
        const decoded = jwt.verify(token,"secretkey")
        req._id=decoded.id
        next()
    }
    catch(err){
        res.status(400).send("something went wrong")
    }
}

module.exports = userAuth