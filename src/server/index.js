// importing express
const express = require('express');
require('dotenv').config();
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload')
const dbConnect = require('./config/dbConnect');
const blogRoutes = require('./routes/blog');
const userRoutes = require('./routes/user');

// initializing app
const app = express();
const port = process.env.PORT || 8000;

// mounting middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(cookieParser());
app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : '/tmp/'
}));

// connecting db
dbConnect();

// mounting routes
app.use('/api/v1/blogs', blogRoutes);
app.use('/api/v1/user', userRoutes);

// default route
app.get('/health', (req, res) => {
  res.status(200).json({
    success : true,
    message : "Server is up and running..."
  });
})

// starting server
app.listen(port, () => console.log(`Server is running on port : ${port}`));


