// Importing mongoose
const mongoose = require('mongoose');

// Defining Schema
const blogSchema = new mongoose.Schema({
  user : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User"
  },
  title : {
    type : String,
    required : true
  },
  content : {
    type : String,
    required : true
  },
  category : {
    type : String,
    required : true
  },
  tags : {
    type : [String],
    required : true
  },
  image : {
    type : String
  },
  status : {
    type : String,
    enum : ['draft', 'published'],
    required : true,
    default : 'draft'
  }
});

// exporting model
module.exports = mongoose.model('Blog', blogSchema);