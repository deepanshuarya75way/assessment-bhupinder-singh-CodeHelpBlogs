// Importing model
const User = require('../models/User');

// Importing bcrypt to hash password
const bcrypt = require('bcrypt');

// Importing jwt to create token
const jwt = require('jsonwebtoken');

// Importing environment variables
require('dotenv').config();

// Defining route handlers

// 1.signup
exports.signUp = async(req, res) => {
  try{
    // fetch data 
    const {name, email, password} = req.body;
    if(!email || !email || !(password.trim()))
      return res.status(400).json({
        success : false,
        message : "Please provide all the details."
      });
    
    
    // hash the password before storing it in the db
    let hashedPassword = null;
    try{
      hashedPassword = bcrypt.hash(password, 10);
    }catch(err){
      return res.status(500).json({
        success : false,
        message : "Error occurred in hashing password, try again later"
      });
    }

    // save the entry in db
    const savedUser = await User.create({
      name, 
      email,
      password : hashedPassword
    });

    return res.status(201).json({
      success : false,
      user : {...savedUser, password : undefined},
      message : "User registered successfully."
    });
  }catch(err){
    res.status(500).json({
      success : false,
      error : err.message,
      message : 'Signup Controller : Internal Server Error!'
    });
  }
}

// 2.login
exports.login = async(req, res) => {
  try{
    // fetch email and password
    const {email, password} = req.body;
    if(!email || !password)
      return res.status(400).json({
        success : false,
        message : "Please provide all the required details."
      });

    // checking if that user already exists
    const existingUser = await User.findOne({email : email});
    if(!existingUser)
      return res.status(404).json({
        success : false,
        message : "Sign up first."
      });
    
    // if that user already exists then compare password
    if(await bcrypt.compare(password, existingUser.password)){
      // if matched then generate token
      const payload = {
        id : existingUser._id,
        email : existingUser.email
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET);

      // setting the token inside the HTTP-ONLY cookies
      return res.cookie('token', token, {
        httpOnly : true,
        maxAge : 30000
      }).status(200).json({
        success : true,
        message : "User logged in successfully."
      });
    }
    return res.status(401).json({
      success : false,
      message : "Incorrect Password!"
    });
  }catch(err){
    res.status(500).json({
      success : false,
      error : err.message,
      message : 'Login Controller : Internal Server Error!'
    });
  }
}