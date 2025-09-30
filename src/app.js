const express = require("express");
const connectDB = require("./config/database.js");
const cookieParser = require("cookie-parser");
const cors=require("cors");
const app = express();

app.use(cors({
  origin:"http://localhost:5173",
  credentials:true

}));
app.use(express.json()); // converts all req to js object.
app.use(cookieParser()); // for reading the cookies.

const authRouter=require('./routes/auth.js');
const profileRouter=require('./routes/profile.js');
const requestRouter=require('./routes/requests.js');
const userRouter=require('./routes/user.js');

// now these routers can be use as middleware.

app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter);
app.use('/',userRouter);



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
