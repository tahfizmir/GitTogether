const express = require("express");
const { validateSignUpData } = require("../utils/validations");
const validator = require("validator");
const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const authRouter = express.Router();
authRouter.post("/signup", async (req, res) => {
  const { firstName, lastName, emailId, password, about, skills, gender, age } =
    req.body;

  if (!emailId || !password || !gender || !age || !firstName || !lastName) {
    return res.status(400).json({ error: "please fill all required fields" });
  }

  if (req.body?.skills?.length > 5) {
    return res.status(400).json({ error: "maximum 5 skills are allowed" });
  }

  try {
    const existingUser = await User.findOne({ emailId: emailId });
    console.log("existingUser",existingUser);
    if (existingUser) {
      throw Error("Email Id already in use.");
    }
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
    res.status(400).send("ERROR :" + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;

  try {
    if (!validator.isEmail(emailId)) {
      throw new Error("Not a valid email");
    }

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000), // this is cookie expiry. 8hrs
      });

      res.send(user);
    } else {
      res.status(401).send("Invalid email or password");
    }
  } catch (err) {
    res.status(401).send(err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .send("Logged out successfully");
});

module.exports = authRouter;
