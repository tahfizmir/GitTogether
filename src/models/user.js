const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const { Schema, model } = mongoose;
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50,
    },
    lastName: {
      type: String,
      trim: true,
      maxLength: 50,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Not a valid email"],
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password too weak");
        }
      },
    },
    gender: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (
          !["male", "female", "others", "third", "bisexual", "fluid"].includes(
            value
          )
        ) {
          throw new Error("gender data is not valid");
        }
      },
    },
    age: {
      type: Number,
      required: true,
      min: 16,
    },
    photoUrl: {
      type: String,
      default: "https://i.sstatic.net/l60Hf.png",
      validate: {
        validator: (v) => validator.isURL(v),
        message: "Not a valid URL",
      },
    },
    about: {
      type: String,
      default: "I will update my bio soon.",
      trim: true,
      maxLength: 500,
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);
// custom schema method
userSchema.methods.getJWT = function () {
  // Instances of Models are documents i.e user will be a doc
  const user = this;
  const secretKeyJWT = process.env.SECRET_KEY_JWT;
  const token = jwt.sign({ _id: user._id }, secretKeyJWT, {
    // this is synchronous step so no await ,go to docs for more.
    expiresIn: "7d",
  });
  return token;
};
userSchema.methods.validatePassword = async function (passwordInputedByUser) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(
    passwordInputedByUser,
    passwordHash
  );

  return isPasswordValid;
};
module.exports = model("User", userSchema);
