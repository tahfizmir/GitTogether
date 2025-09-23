const express = require("express");
const requestRouter = express.Router();
const userAuth = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User=require("../models/user")

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      // ******* validations for this api ************
      const allowedStatus = ["ignored", "interested"]; // a user can either right swipe or left swipe
      if (!allowedStatus.includes(status)) {
        return res.status(400).send({
          message: "Invalid status type" + status,
        });
      }
      // duplicate connection request
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });
      if (existingConnectionRequest) {
        return res
          .status(400)
          .send({ message: "connection request already exists" });
      }
      // reciever not existing
      const toUser=await User.findById(toUserId);
      if(!toUser){
        return res.status(400).send("User not found")
      }

      // sending request to itself
      if(fromUserId.equals(toUserId)){
         return res.status(400).send("Can't send request to yourself");

      }



      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save(); // save connection request in database.
      res.json({
        message: req.user.firstName + " sent a "+ status + " connection request to "+toUser.firstName ,
        data,
      });
    } catch (err) {
      res.send(err.message);
    }
  }
);
module.exports = requestRouter;
