const express=require("express");
const profileRouter=express.Router();
const {validateEditProfileData}=require("../utils/validations");
const authUser=require('../middleware/auth');
profileRouter.get("/profile/view", authUser, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
profileRouter.patch("/profile/edit", authUser, async(req,res)=>{
    try{
        if(!validateEditProfileData(req)){
            throw new Error("Invalid edit request");
        }

        const loggedInUser=req.user;  // logged in user.
        // lets patch this user.
        Object.keys(req.body).forEach((key)=>(loggedInUser[key]=req.body[key]));

        await loggedInUser.save();
        
        res.send(loggedInUser.firstName+", Your profile is updated successfully");

    }catch (err) {
  res.status(400).json({
    message: err.message,
    stack: err.stack
  });
}
})

module.exports=profileRouter;