// Importing mongoose
const mongoose = require('mongooose');

// Importing environment variables
require('dotenv').config();

// Function to establish connection to the db
const dbConnect = async() => {
  try{
    await mongoose.connect(process.env.DB_URL);
    console.log("✅ MongoDB Connected Successfully");
  }catch(err){
    console.log("❌ Error Connecting DB :",err.message);
    console.log("Retrying in 5 seconds...");
    setTimeout(dbConnect, 5000);
  }
}

// exporting function 
module.exports = dbConnect;