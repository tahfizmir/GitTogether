const express = require('express'); 
const {authAdmin,authUser}=require("./middleware/auth");
const app = express();

app.use("/user",[authUser,(req,res)=>{
    res.send('user authenticated');
}])
app.use("/admin",authAdmin,(req,res)=>{
    res.status(200).send('admin authenticated');
})
app.use("/",(err,req,res,next)=>{
    if(err){
        res.status(500).send('something went wrong')
    }
})

app.listen(3000,()=>{
    console.log("server is listening at 3000");
})