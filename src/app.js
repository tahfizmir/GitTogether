const express = require('express'); 
const {authAdmin,authUser}=require('./middleware/auth');
const connectDB=require('./config/database.js');
const app = express();


connectDB().then(()=>{
    console.log("database connected successfully");
    app.listen(3000,()=>{
    console.log("server is listening at 3000");
})
}).catch((err)=>{
    console.log("error in connecting database")
})
