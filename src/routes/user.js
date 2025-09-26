const express = require("express");
const authUser = require("../middleware/auth");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");

const userDataArray = [
  "firstName",
  "lastName",
  "age",
  "gender",
  "photoUrl",
  "about",
  "skills",
];
// to get all the pending requests
userRouter.get("/user/requests/recieved", authUser, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", userDataArray); // basically fromUserId matches with _id in the User collection.,
    // if we dont pass this array then all fields will be returned.
    res.json({
      message: "Requests fetched successfully",
      data: connectionRequest,
    });
  } catch (err) {
    res.send(err.message);
  }
}); 

userRouter.get("/user/connections", authUser, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionsArray = await ConnectionRequest.find({
      $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
      status: "accepted",
    })
      .populate("fromUserId", userDataArray)
      .populate("toUserId", userDataArray);
    const data = connectionsArray.map((field) =>{
        if(field.toUserId._id.toString()===loggedInUser._id.toString()){
            return field.fromUserId;
        }
        return field.toUserId;
    });
    res.json(data);
  } catch (err) {
    res.send(err.message);
  }
});

module.exports = userRouter;
