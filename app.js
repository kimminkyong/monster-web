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

var sha256 = require('sha256');

var auth = require('./routes/admin/auth');

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
  req.headers.Authorization = "Bearer xxxxxxx"
  next();
});



console.log('init')
//app.use(auth.initialize()); // 초기화

// app.use(session({
//   secret:'rlaalsrud',
//   resave:false,
//   saveUninitialized:false
// }));
// app.use(passport.initialize());
// app.use(passport.session());

app.use(expressVaildator());

// passport.serializeUser(function(user, done){
//   console.log("serializeUser");
//   done(null, user.id);
// });
// passport.deserializeUser(function(email, done){
//   console.log("deserializeUser");
//   // console.log(email);
//   // connection.query('SELECT * FROM USERS WHERE `email`=?', [email], function(err, rows){
//   //   var user = rows[0];
//   //   console.log(user);
//     done(err,  user);
 

// });


// passport.use(new LocalStrategy({
//   usernameField:'email',
//   passwordField:'password'
// }, function(email, password, done){
//   console.log(email);
//   connection.query('SELECT * FROM USERS WHERE `email`=?', [email], function(err, rows){
//     var user = rows[0];
//     console.log("LocalStrategy");
//     console.log(user);
//     if (err){
//       return done(err);
//     }
//     if(!user){
//       console.log('Incorrect username.');
//       return done(null, false, {message : 'Incorrect username.'});
//     }
//     if(user.password !== sha256(password+email) ){
//       console.log('Incorrect password.');
//       return done(null, false, {message : 'Incorrect password.'});
//     }
//     var nowdate = new Date(Date.now()).toISOString().replace(/T/, ' ').replace(/\..+/, '');
//     connection.query('UPDATE USERS SET last_join_date = ? WHERE `email`=?', [nowdate, email], function(err, rows){
//       console.log(nowdate);
//       if(rows){
//         console.log('last_join_date update success');
//       }else{
//         console.log('last_join_date update fail');
//       }
//     });

//     console.log(Number(user.grade) < 2);
//     if(Number(user.grade) < 2){
//       console.log('wait');
//       return done(null, false, {message : 'wait'});
//     }
//       //location.href('/member/wait');
    
//     return done(err, user);
    
    
//   });

// }));



// app.post('/',passport.authenticate('local', {
//   successRedirect:'/member/login',
//   failureRedirect:'/member/login'
//   //,failureFlash:true
// }));
app.use('/', siteRouter);
app.use('/admin', indexRouter);
app.use('/m', mRouter);

app.use('/admin/users', usersRouter);
app.use('/admin/alg-list', alglistRouter);
app.use('/admin/member', memberRouter);
app.use('/admin/chart', chartRouter);

app.use('/m/user', mUserRouter);

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
