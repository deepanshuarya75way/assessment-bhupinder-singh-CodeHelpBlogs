// Importing express
const express = require('express');

// creating an instance of the router
const router = express.Router();

// Importing route handlers
const {getAllBlogs, createBlog, updateBlog, getSingleBlogById} = require('../controllers/blog');

// Importing middlewares
const {authentication} = require('../middlewares/auth');

// Mapping controllers 
router.get('/', getAllBlogs);
router.get('/blog/:id', getSingleBlogById);
router.post('/', authentication, createBlog);
router.patch('/blog/:id',authentication,  updateBlog);

// exporting router
module.exports = router;
