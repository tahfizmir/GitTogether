const express = require('express'); 
const {authAdmin,authUser}=require('./middleware/auth');
const connectDB=require('./config/database.js');
const User=require('./models/user.js');

const app = express();

app.post('/signup',async (req,res)=>{
    const dummy_data={
        firstName:"Tahfiz",
        lastName:"Mir",
        emailId:"tahfeezmir27@gmail.com",
        password:"hello",
    }


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
