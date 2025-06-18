const express = require("express")
const app = express()
const userAuth = require("./middleware/auth")
const connectDB = require("./config/database")
const User = require("./models/user")
const validator = require("validator")
const bcrypt = require("bcrypt")
app.use(express.json())
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
app.use(cookieParser())


app.post("/signup", async (req,res)=>{
    try{
        // firstly validate sigup data 
        const isValidEmail = validator.isEmail(req.body.emailId)
        if(!isValidEmail) return res.status(400).send("Please enter valid Email Id")

        // encrpyt the password
        const {firstName,lastName,skills,about,gender,age,password,emailId,photoUrl} = req.body
        const hashedPassword = await bcrypt.hash(password,10)


        const user = new User(
            {firstName,lastName,skills,about,gender,age,password: hashedPassword,emailId,photoUrl}
        );
        await user.save();
        res.send(user.firstName + " Signed Up Successfully")
    }
    catch(err){
        res.status(400).send("Unable to add new user")
    }
    
})


app.post("/login", async (req, res) => {
  try {

    // email password nikaala request ki body se
    const { emailId, password } = req.body;

    // check kiya ki wo email wala user hain ki nahi 
    const user = await User.findOne({ emailId });

    // agar user nahi mila invalid credentials hain matlab
    if (!user) {
      return res.status(400).send("Invalid credentials");
    }

    /* agar user mil gaya to check kiya ki mile hue user ka 
       password, entered user ke password se match kiya ya nahi */
    const isMatch = await bcrypt.compare(password, user.password);

    // agar password match nahi means invalid credentials
    if (!isMatch) {
      return res.status(400).send("Invalid credentials");
    }

    // agar password bhi match karta hain -> log in successfull
    // matlab ab jwt banakar bhejna padega re baba

    // create a jwt token
    const token = jwt.sign({ id: user._id }, "secretkey", { expiresIn: "10d" });
 
    // send token wrapped into a cookie
    res.cookie("token", token, {
      httpOnly: true, // Can't be accessed by JS on frontend
      maxAge: 10 * 24 * 60 * 60 * 1000, // 10 day
    });

    // ab response bhejo client ko iske saath hi cookie autosent ho jayega
    res.send(`Mr.${user.firstName} logged in successfully`);
  } catch (err) {
    res.status(500).send("Server error while logging in");
  }
});




app.get("/profile", userAuth , async (req,res)=>{
    try{
        const user = await User.findById(req._id)
        return res.json(user);
    }
    catch(err){
        res.status(400).send("Unable to fetch your profile")
    }
    
})


app.get("/feed", userAuth, async (req,res)=>{
    try{
        const allUsers = await User.find()
        res.send(allUsers)
    }
    catch(err){
        res.status(400).send("Unable to get users")
    }
    
})


app.patch("/user/:userId", userAuth, async (req,res)=>{
    try{
        const userId= req.params.userId
        const data = req.body
        const allowedUpdates = ["firstName" , "lastName" ,"skills","about","photoUrl","age","password"]
        const isUpdateAllowed = Object.keys(data).every((k)=> allowedUpdates.includes(k));
        if(!isUpdateAllowed) return  res.status(400).send("Updating EmailId is not allowed and adding random fields is not allowed")
        const user = await User.findByIdAndUpdate(userId,data)
         return res.send("User data updated Successfully")
    }
    catch(err){
        res.status(400).send("Unable to update user data")
    }
    
})

app.post("/connectionRequest/:userId", userAuth, async (req,res)=>{
    try{
        const toUser = await User.findById(req.params.userId)
        const fromUser = await User.findById(req._id)
        res.send(fromUser.firstName + " sent connection request to " + toUser.firstName)
    }
    catch(err){
        res.status(400).send("Unable to send connection request")
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
