// Importing cloudinary
const cloudinary = require('../config/cloudinary');

// Function to upload the image
async function uploadImage(file){
  return cloudinary.uploader.upload(file.tempFilePath);
}

// exporting the function 
module.exports = uploadImage;