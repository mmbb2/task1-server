var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');
const cors = require('cors');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(cors({
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    origin: ['http://localhost:3000']
}))
app.use(session({
    secret: 'eyfhrgfgrfrty84fwir767',
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

module.exports = app;
