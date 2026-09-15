// Importing mongoose
const mongoose = require('mongoose');

// Defining Schema
const userSchema = new mongoose.Schema({
  name : {
    type : String,
    required : true
  },
  email : {
    type : String,
    required : true
  },
  password : {
    type : String,
    required : true
  },
  blogs : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : "Blog"
  }]
});

// exporting model
module.exports = mongoose.model('User', userSchema);