var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var logger = require('morgan');

var expressVaildator = require('express-validator');



// database
var mysql = require('mysql');
var dbconfig = require('./config/database.js');
var connection = mysql.createConnection(dbconfig);

// basic router
var siteRouter = require('./routes/index');

//admin router
var indexRouter = require('./routes/admin/index');
var usersRouter = require('./routes/admin/users');
var alglistRouter = require('./routes/admin/alg-list');
var memberRouter = require('./routes/admin/member');
var chartRouter = require('./routes/admin/chart');

// mobile router
var mRouter = require('./routes/m/main');
var mUserRouter = require('./routes/m/user');
var mProduct = require('./routes/m/product');
var mSubscribe = require('./routes/m/subscribe');
var mMypage = require('./routes/m/mypage');
var mNotice = require('./routes/m/notice');
var mFavorite = require('./routes/m/favorite');
var mPopup = require('./routes/m/popup');
var sha256 = require('sha256');

var auth = require('./routes/admin/auth');

//api
var apiAuth = require('./routes/api/auth');
var apiUsers = require('./routes/api/users');
var apiUser = require('./routes/api/user');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'content-type, x-access-token');
  var getToken = req.cookies.token;
  res.set('x-access-token', getToken);
  req.headers.Authorization = "Bearer xxxxxxx";
  next();
});



app.use(expressVaildator());

app.use('/', siteRouter);

app.use('/admin', indexRouter);
app.use('/admin/users', usersRouter);
app.use('/admin/alg-list', alglistRouter);
app.use('/admin/member', memberRouter);
app.use('/admin/chart', chartRouter);

app.use('/m', mRouter);
app.use('/m/user', mUserRouter);
app.use('/m/product', mProduct);
app.use('/m/subscribe', mSubscribe);
app.use('/m/mypage', mMypage);
app.use('/m/notice', mNotice);
app.use('/m/favorite', mFavorite);
app.use('/m/popup', mPopup);

//api
app.use('/api/auth', apiAuth);
app.use('/api/users', apiUsers);
app.use('/api/user', apiUser);

console.log('init');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler1
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
