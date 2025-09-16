const express = require("express");
const connectDB = require("./config/database.js");
const User = require("./models/user.js");
const validateSignUpData = require("./utils/validations.js");
const validator = require("validator");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { authUser } = require("./middleware/auth.js");
dotenv.config();

const app = express();

app.use(express.json()); // converts all req to js object.
app.use(cookieParser()); // for reading the cookies.


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

// login api
app.post("/login", async (req, res) => {
  const { emailId, password } = req.body;

  try {
    if (!validator.isEmail(emailId)) {
      throw new Error("Not a valid email");
    }

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      const secretKeyJWT = process.env.SECRET_KEY_JWT;
      // create jwt token
      const token = await jwt.sign({ _id: user._id }, secretKeyJWT,{expiresIn:'7d'});

      // send the cookie with the response

      res.cookie("token", token);

      res.send("Login Successful");
    } else {
      res.send("Invalid email or password");
    }
  } catch (err) {
    res.send("ERROR : " + err);
  }
});

// get my profile
app.get("/profile", authUser, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
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
