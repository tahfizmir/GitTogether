const mongoose = require('mongoose');
const dotenv = require("dotenv");
// Load environment variables from .env file
dotenv.config();
const connectDB = async()=>{
   await mongoose.connect(process.env.DB_URL);
}
module.exports=connectDB;