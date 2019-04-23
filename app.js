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

//router
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var alglistRouter = require('./routes/alg-list');
var memberRouter = require('./routes/member');
var chartRouter = require('./routes/chart');
var sha256 = require('sha256');

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
app.use(session({
  secret:'rlaalsrud',
  resave:false,
  saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(expressVaildator());

passport.serializeUser(function(user, done){
  console.log("serializeUser");
  done(null, user.email);
});
passport.deserializeUser(function(email, done){
  console.log("deserializeUser");
  console.log(email);
  connection.query('SELECT * FROM USERS WHERE `email`=?', [email], function(err, rows){
    var user = rows[0];
    console.log(user);
    done(err, user);
  });

});

passport.use(new LocalStrategy({
  usernameField:'email',
  passwordField:'password'
}, function(email, password, done){
  console.log(email);
  connection.query('SELECT * FROM USERS WHERE `email`=?', [email], function(err, rows){
    var user = rows[0];
    console.log("LocalStrategy");
    console.log(user);
    if (err){
      return done(err);
    }
    if(!user){
      console.log('Incorrect username.');
      return done(null, false, {message : 'Incorrect username.'});
    }
    if(user.password !== sha256(password+email) ){
      console.log('Incorrect password.');
      return done(null, false, {message : 'Incorrect password.'});
    }
    var nowdate = new Date(Date.now()).toLocaleString();
    connection.query('UPDATE USERS SET last_join_date = ? WHERE `email`=?', [nowdate, email], function(err, rows){
      console.log(nowdate);
      if(rows){
        console.log('last_join_date update success');
      }else{
        console.log('last_join_date update fail');
      }
    });

    console.log(Number(user.grade) < 2);
    if(Number(user.grade) < 2){
      console.log('wait');
      return done(null, false, {message : 'wait'});
    }
      //location.href('/member/wait');
    
    return done(err, user);
    
    
  });

}));

// app.post('/',passport.authenticate('local', {
//   successRedirect:'/member/login',
//   failureRedirect:'/member/login'
//   //,failureFlash:true
// }));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/alg-list', alglistRouter);
app.use('/member', memberRouter);
app.use('/chart', chartRouter);

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
