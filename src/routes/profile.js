const express=require("express");
const profileRouter=express.Router();
const authUser=require('../middleware/auth');
profileRouter.get("/profile", authUser, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports=profileRouter;