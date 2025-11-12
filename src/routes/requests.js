const express = require("express");
const requestRouter = express.Router();
const userAuth = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const sendEmail = require("../utils/sendEmail");

// api to send requests
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
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(400).send("User not found");
      }

      // sending request to itself
      if (fromUserId.equals(toUserId)) {
        return res.status(400).send("Can't send request to yourself");
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save(); // save connection request in database.

      const emailRes = await sendEmail.run({
        subject: "New Connection Request",
        text: `${req.user.firstName} sent a ${status} connection request to ${toUser.firstName}`,
        html: `<h3>${req.user.firstName} sent a ${status} connection request to ${toUser.firstName}</h3>`,
      });
      console.log("email response", emailRes);
      res.json({
        message:
          req.user.firstName +
          " sent a " +
          status +
          " connection request to " +
          toUser.firstName,
        data,
      });
    } catch (err) {
      res.send(err.message);
    }
  }
);

// api to respond to request either accept it or reject.
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { requestId, status } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Status sent should either be accepted or rejected",
        });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "connection request not found" });
      }
      connectionRequest.status = status;
      const data = await connectionRequest.save();

      const emailRes = await sendEmail.run({
        subject: "Response to your connection Request",
        text: `${toUser.firstName} responded with a ${status} to your connection request`,
        html: `<h3>${toUser.firstName} responded with a ${status} to your connection request</h3>`,
      });
      console.log("email response", emailRes);
      res.status(200).json({
        mesasge: "connection request " + status + " successfully.",
        data,
      });
    } catch (err) {
      return res.status(400).send(err.mesasge);
    }
  }
);

module.exports = requestRouter;
