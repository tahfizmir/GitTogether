const express = require("express");
const connectDB = require("./config/database.js");
const User = require("./models/user.js");
const validateSignUpData = require("./utils/validations.js");
const bcrypt = require("bcrypt");

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

// signup api
app.post("/signup", async (req, res) => {
  const { firstName, lastName, emailId, password, about, skills, gender, age } =
    req.body;

  if (!emailId || !password || !gender || !age) {
    return res.status(400).json({ error: "please fill all required fields" });
  }

  if (req.body?.skills?.length > 5) {
    return res.status(400).json({ error: "maximum 5 skills are allowed" });
  }

  try {
    // validating the user
    validateSignUpData(req);
    // encrypting the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newuser = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
      age,
      gender,
      about,
      skills,
    });
    await newuser.save();
    res.send("new user saved successfully");
  } catch (err) {
    res.send("ERROR :" + err.message);
  }
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

// login api
app.post("/login", async (req, res) => {
  const { emailId, password } = req.body;

  try {
    if(!validator.isEmail(emailId)){
      throw new Error("Not a valid email");
    }

    const user=await User.findOne({emailId:emailId});
    if(!user){
      throw new Error("No valid user for this email id")
    }

    const isPasswordValid = await bcrypt.compare(password,user.password);
    
    if(isPasswordValid){
      res.send("Login Successful")
    }else{
      res.send("wrong password! try again")
    }

   
  } catch (err) {}
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = ["photoUrl", "skills", "about"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("update not allowed for this combination of fields");
    }
    const updatedUser = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "before",
      runValidators: true,
    });
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
