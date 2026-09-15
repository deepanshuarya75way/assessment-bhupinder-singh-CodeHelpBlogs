// Importing Models
const User = require('../models/User');
const Blog = require('../models/Blogs');

// Importing the function to upload image on the cloudinary
const uploadImage = require('../services/cloudinary.service');

// Importing mongoose
const mongoose = require('mongoose');

// Defining Route Handlers

// 1.getAllBlogs
exports.getAllBlogs = async(req, res) => {
  try{
    // fetch all the blogs from db
    const blogs = await Blog.find({}).populate('user', 'name email').exec();

    res.status(200).json({
      success : true,
      data : blogs,
      message : "All blogs fetched successfully."
    })
  }catch(err){
    res.status(500).json({
      success : false,
      error : err.message,
      message : "Get All Blogs : Internal Server Error"
    });
  }
}

// 2.createBlog
exports.createBlog = async(req, res) => {
  try{
    const userId = req?.user?.id;
    if(!userId)
      return res.status(401).json({
        success : false,
        message : "Please login again!"
      });
    
    if(!mongoose.isValidObjectId(userId))
      return res.status(401).json({
        success : false,
        message : "Invalid user id."
      })

    // checking if that user exists in the db
    const existingUser = await User.findById(userId);
    if(!existingUser)
      return res.status(403).json({
        success : false,
        message : "User does not exists."
      });

    // fetch data
    const {title, content, category, tags} = req.body;

    if(!title || !content || !category || !tags)
      return res.status(400).json({
        success : false,
        message : "Please send all the required details."
      })
    
    // fetching cover image
    const coverImage = req?.files?.image;

    if(!coverImage)
      return res.status(400).json({
        success : false,
        message : "Please upload the cover image also."
      })

    // uploading the image on the cloudinary
    let uploadedAsset = null;
    try{
      uploadedAsset = await uploadImage(coverImage);
    }catch(err){
      return res.status(500).json({
        success : false,
        err : err.message,
        message : "Error upload image, try again after some time!"
      });
    }
    
    // saving the entry to db
    const savedBlog = await Blog.create({
      title,
      content,
      category,
      tags,
      user : userId,
      image : uploadedAsset.secure_url
    });

    // returning response
    return res.status(201).json({
      success : true,
      data : savedBlog,
      message : "Blog saved to draft successfully!"
    });
    
  }catch(err){
    res.status(500).json({
      success : false,
      error : err.message,
      message : "Create Blog : Internal Server Error"
    });
  }
}

// 3.Update Blog
exports.updateBlog = async(req, res) => {
  try{
    const userId = req?.user?.id;
    if(!userId)
      return res.status(401).json({
        success : false,
        message : "Please login again!"
      });
    
    if(!mongoose.isValidObjectId(userId))
      return res.status(401).json({
        success : false,
        message : "Invalid user id."
      })

    // checking if that user exists in the db
    const existingUser = await User.findById(userId);
    if(!existingUser)
      return res.status(403).json({
        success : false,
        message : "User does not exists."
      });
    
    // fetch data 
    const {title, content, category, tags, status} = req.body;
    const blogId = req.params.id;

    // checking if that blog exists
    if(!blogId)
      return res.status(400).json({
        success : false,
        message : "Please provide blog id."
      });
    
    if(!mongoose.isValidObjectId)
      return res.status(400).json({
        success : false,
        message : "Invalid Blog Id."
      });

    const existingBlog = await Blog.findById(blogId);
    if(!existingBlog)
      return res.status(404).json({
        success : false,
        message : "Blog does not exists!"
      });

    // uploading cover image, if provided
    const coverImage = req?.files?.image;
    let uploadedAsset = null;
    if(coverImage){
      try{
        uploadedAsset = await uploadImage(coverImage);
      }catch(err){
        return res.status(500).json({
          success : false,
          err : err.message,
          message : "Error upload image, try again after some time!"
        });
      }
    }

    // updating only the feilds provided
    const update = {
      user : userId
    };
    if(title) update.title = title;
    if(content) update.content = content;
    if(category) update.category = category;
    if(tags) update.tags = tags;
    if(status) update.status = status;
    if(uploadedAsset) update.image = uploadedAsset.secure_url;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {$set : update},
      {new : true, runValidators : true}
    );

    return res.status(200).json({
      success : true,
      data : updatedUser,
      message : "User updated successfully."
    })

  }catch(err){
    res.status(500).json({
      success : false,
      error : err.message,
      message : "Update Blog : Internal Server Error"
    });
  }
}

// 4.getSingleBlogById
exports.getSingleBlogById = async(req, res) => {
  try{
    const blogId = req.params.id;
    if(!blogId)
      return res.status(400).json({
        success : false,
        message : "Please provide blogId."
      });

    if(!mongoose.isValidObjectId(blogId))
      return res.status(400).json({
        success : false,
        message : "Invalid blog id."
      });
    
    // checking if that blog exists
    const existingBlog = await Blog.findById(blogId);
    if(!existingBlog)
      return res.status(404).json({
        success : false,
        message : "Blog does not exists."
      });
    
    return res.status(200).json({
      success : true,
      data : existingBlog,
      message : "Blog fetched successfully"
    });
  }catch(err){
    res.status(500).json({
      success : false,
      error : err.message,
      message : "Update Blog : Internal Server Error"
    });
  }
}