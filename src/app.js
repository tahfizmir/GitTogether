const express = require("express");
const { authAdmin, authUser } = require("./middleware/auth");
const connectDB = require("./config/database.js");
const User = require("./models/user.js");

const app = express();
app.use(express.json()); // converts req to js object

// fetch particular user with email
app.get("/user", async (req, res) => {
  try {
    const userEmail = req.body.emailId;
    const users = await User.find({ emailId: userEmail });
    if (users.length === 0) {
      res.status(404).send("user not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res
      .status(400)
      .send("something went wrong in fetching user with error: ", err);
  }
});

// get all the users for feed
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      res.status(404).send("no users");
    } else {
      res.send(users);
    }
  } catch (err) {
    res
      .status(400)
      .send("something went wrong in fetching users with error: ", err);
  }
});

app.post("/signup", async (req, res) => {
  const userData = req.body;

  try {
    const newuser = new User(userData);
    await newuser.save();
    res.send("new user saved successfully");
  } catch (err) {}
});

app.delete("/user", async (req, res) => {
  const userID = req.body._id;
  try {
    const deletedUser = await User.findByIdAndDelete(userID);
    if (deletedUser) {
      res.send("User deleted successfully");
    } else {
      res.status(404).send("User id not found");
    }
  } catch (err) {
    res.send("error in deleting user ", err);
  }
});

app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, data,{returnDocument:'before',runValidators:true});
    if (!updatedUser) {
      res.status(404).send("User not found");
    } else {
      res.send("user updated successfully");
    }
  } catch (err) {
    res.status(400).json({ error: err.message });

  }
});

connectDB()
  .then(() => {
    console.log("database connected successfully");
    app.listen(3000, () => {
      console.log("server is listening at 3000");
    });
  })
  .catch((err) => {
    console.log("error in connecting database");
  });
