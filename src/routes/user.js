const express = require("express");
const authUser = require("../middleware/auth");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

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
    const data = connectionsArray.map((field) => {
      if (field.toUserId._id.toString() === loggedInUser._id.toString()) {
        return field.fromUserId;
      }
      return field.toUserId;
    });
    res.json(data);
  } catch (err) {
    res.send(err.message);
  }
});

//++++ FEED API ++++
// user should not see his profile, profiles he has ignored or interested
// or accepted or rejected,
// or the profiles that are his connections.
userRouter.get("/user/feed", authUser, async (req, res) => {
  try {
    const loggedInUser = req.user;
    // pagination
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Number(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    // all connectionRequests the user has sent or recieved
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hiddenFromFeedUsers = new Set();

    connectionRequests.forEach((req) => {
      hiddenFromFeedUsers.add(req.fromUserId.toString());
      hiddenFromFeedUsers.add(req.toUserId.toString());
      /* converting to string is mandatory as ObjectId("...") 
         creates new object instance 
         and js set compares reference and not values so we would get duplicate entry  */
    });
    const usersToBeShown = await User.find({
      $and: [
        { _id: { $nin: Array.from(hiddenFromFeedUsers) } }, // not in query
        { _id: { $ne: loggedInUser._id } }, // not equals query
      ],
    })
      .select(userDataArray)
      .skip(skip)
      .limit(limit);
    res.send(usersToBeShown);
  } catch (err) {
    res.send(err.message);
  }
});

module.exports = userRouter;
