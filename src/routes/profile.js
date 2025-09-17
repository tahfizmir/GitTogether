const express = require("express");
const profileRouter = express.Router();
const { validateEditProfileData } = require("../utils/validations");
const authUser = require("../middleware/auth");
const bcrypt=require("bcrypt");

profileRouter.get("/profile/view", authUser, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
profileRouter.patch("/profile/edit", authUser, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid edit request");
    }

    const loggedInUser = req.user; // logged in user.
    // lets patch this user.
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, Your profile is updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
      stack: err.stack,
    });
  }
});

profileRouter.patch("/profile/changepassword", authUser, async (req, res) => {
  const user = req.user;
  // we are considering that the user will first enter his current password then we
  // allow him to change the password even if the user is logged in.

  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "Both current and new password are required" });
  }
  if (currentPassword === newPassword) {
    return res
      .status(400)
      .json({
        message: "New password must be different from current password",
      });
  }

  try {
    // verify current password
    const isPasswordValid = await user.validatePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect current password" });
    }

    // hash and save new password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(400).json({
      message: err.message,
      stack: err.stack,
    });
  }
});

module.exports = profileRouter;
