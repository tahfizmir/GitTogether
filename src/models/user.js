const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!["male,female,others"].includes(value)) {
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
    },
    about: {
      type: String,
      default: "I will update my bio soon.",
      trim: true,
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
