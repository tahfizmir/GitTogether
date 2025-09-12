const dotenv = require("dotenv");
dotenv.config();

const authAdmin = (req, res, next) => {
  const token = "xyz";
  const isAuthenticated = token === "xyz";
  if (!isAuthenticated) {
    res.status(401).send("unauthorised admin");
  } else {
    next();
  }
};
const jwt = require("jsonwebtoken");

const authUser = (req) => {
  const { token } = req.cookies;
  const secretKeyJWT = process.env.SECRET_KEY_JWT;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, secretKeyJWT);
    return decoded;
  } catch (err) {
    return null;
  }
};

// this is a temporary auth function that will be later modified to call next()

module.exports = { authAdmin, authUser };
