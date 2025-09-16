const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const User=require("../models/user");
dotenv.config();

const authUser = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token not valid.");
    }
    const secretKeyJWT = process.env.SECRET_KEY_JWT;

    const decodedObj = jwt.verify(token, secretKeyJWT);
    const { _id } = decodedObj;
    const user= await User.findOne({_id});
    if(!user){
      throw new Error("Could not fetch user");
    }
    req.user=user;
    next();
  } catch (err) {
    res.status(400).send(err);
  }
};

// this middleware can be used at any place where
// we want to first validate if the user is logged in.

module.exports = authUser;
