const adminAuth = (req,res,next)=>{
    const token = "abc"
    const isAuthorised = token === "dfvbf"
    if(!isAuthorised) res.status(401).send("admin is unauthorised")
    else next();
}

module.exports = {adminAuth}