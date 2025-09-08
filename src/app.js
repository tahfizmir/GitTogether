const express = require('express'); 
const {authAdmin,authUser}=require('./middleware/auth');
const connectDB=require('./config/database.js');
const User=require('./models/user.js');

const app = express();
app.use(express.json()); // converts req to js object

// fetch particular user with email
app.get("/user",async (req,res)=>{
    try{
        const userEmail=req.body.emailId;
        const users=await User.find({emailId:userEmail});
        if(users.length===0){
            res.status(404).send("user not found");

        }else{
            res.send(users);
        }

    }catch(err){
       
        res.status(400).send("something went wrong in fetching user with error: ",err);
    }
})

// get all the users for feed
app.get("/feed",async (req,res)=>{
    try{
        
        const users=await User.find({});
        if(users.length===0){
            res.status(404).send("no users");

        }else{
            res.send(users);
        }

    }catch(err){
       
        res.status(400).send("something went wrong in fetching users with error: ",err);
    }
})

app.post('/signup',async (req,res)=>{
    const dummy_data=req.body;
    console.log("dummy_data",dummy_data);


   try{ const newuser=new User(dummy_data);
    await newuser.save();
    res.send("new user saved successfully")}
    catch(err){
       
    }
})

connectDB().then(()=>{
    console.log("database connected successfully");
    app.listen(3000,()=>{
    console.log("server is listening at 3000");
})
}).catch((err)=>{
    console.log("error in connecting database")
})
