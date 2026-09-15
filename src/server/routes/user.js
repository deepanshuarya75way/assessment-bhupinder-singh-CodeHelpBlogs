// Importing express
const express = require('express');

// creating an instance of the router
const router = express.Router();

// Importing route handlers
const {login, signUp} = require('../controllers/user');

// Mapping controllers
router.post('/login', login);
router.post('/signup', signUp);

// exporting router
module.exports = router;