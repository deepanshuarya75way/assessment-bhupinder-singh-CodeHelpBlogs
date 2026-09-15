// Importing cloudinary
const cloudinary = require('cloudinary').v2;

// Configuring
cloudinary.config({
  cloud_name : process.env.CLOUD_NAME,
  api_key : process.env.CLOUD_API_KEY,
  api_secret : process.env.CLOUD_API_SECRET
})

// exporting it
module.exports = cloudinary;