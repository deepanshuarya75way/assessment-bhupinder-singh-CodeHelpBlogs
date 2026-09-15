// Importing jwt library
const jwt = require('jsonwebtoken');

// Importing environment variables
require('dotenv').config();

exports.authentication = async(req, res, next) =>{
  try{
    // fetching token
    const token = req?.cookies?.token || req.headers.authorization.replace("Bearer ", "");
    if(!token)
      return res.status(401).json({
        success : false,
        message : "Login again!"
      });
    // veryfying token
    try{
      const decode = await jwt.verify(token, process.env.JWT_SECRET);
      req.user = decode;
      next();
    }catch(err){
      return res.status(401).json({
        success : false,
        message : "Invalid token"
      });
    }
  }catch(err){
    res.stautus(500).json({
      success : false,
      error : err.message,
      message : "Authentication Middleware : Internal Server Error!"
    });
  }
}