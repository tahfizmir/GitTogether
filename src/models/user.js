const mongoose = require("mongoose");
const validator = require("validator");
const { Schema, model } = mongoose;
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50
    },
    lastName: {
      type: String,
      trim: true,
      maxLength: 50
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
      validate(value){
        if(!validator.isStrongPassword(value)){
          throw new Error("Password too weak")
        }
      }
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
      maxLength: 500
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
