const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const logger = require('morgan');
const cors = require('cors');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const mongoose = require('mongoose')
require('dotenv').config();

var app = express();

app.use(cors({
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ["Authorization"],
    origin: ['http://localhost:3000']
}))
app.use(session({
    secret: process.env.JWT_ACCESS_SECRET,
    saveUninitialized: false,
    resave: false, 
    cookie: {
        secure: false, 
        httpOnly: true, 
        maxAge: 1000*5
    }
  }))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

const start = async () => {
    try {
      await mongoose.connect(process.env.MONGO_DB_CONNECTION);
    } catch (e) {
      console.log(e);
    }
  };
  
  start();

module.exports = app;
