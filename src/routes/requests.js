const express=require('express');
const requestRouter=express.Router();
const userAuth=require('../middleware/auth');

requestRouter.post("/sendConnectionRequest",userAuth,async (req,res)=>{
    const user=req.user;
    console.log("sent a connection request");
    res.send(user.firstName+" sent a connection request");
});
module.exports=requestRouter;