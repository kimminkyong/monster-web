var jwt = require('jsonwebtoken');
var cfg = require('../../config/jwt_config');

var mysql = require('mysql');
var dbconfig = require('../../config/database.js');
var connection = mysql.createConnection(dbconfig);



exports.login = (req, res) => {
  var email = req.body.email;
  var password = req.body.password;
  var secret = cfg.jwtSecret;



  connection.query('SELECT * FROM USERS WHERE `email`=?', [email], function(err, rows){
            var user = rows[0];
            console.log("query");
            console.log(user);
            
            var token = jwt.sign({
                email: user.email,
                nick: user.nick
              }, 
              secret, 
              {
                  expiresIn: '6h',
                  issuer: 'monster.com',
                  subject: 'userToken'
              });
            console.log(token);
            //res.set('x-access-token', token);
            res.cookie('token',token);
            res.cookie('token', token, { expires: new Date(Date.now() + (900000*6)), httpOnly: true });
            //var getToken = req.cookies.token;
            res.set('x-access-token', token);
            res.json({
              token: token
            });
            
        });




}


exports.check = (req, res, next) => {
    var token = req.cookies.token;
    console.log(token);
    if(token){
      jwt.verify(token, cfg.jwtSecret, function(err, decoded) {
          if(err) {
              console.log(err);
              //res.redirect('/member/login');
          }else{
              console.log(decoded.email);
              req.user = decoded;
              next();
          }
      });
    }else{
      res.redirect('/admin/member/login');
    }

  
}





// var passport = require('passport');
// var passportJWT = require('passport-jwt');
// //var users = require('./users');

// var cfg = require('../config/jwt_config');
// var ExtractJwt = passportJWT.ExtractJwt;
// var Strategy = passportJWT.Strategy;

// var params = {
//   // JWT 비밀키
//   secretOrKey: cfg.jwtSecret,
//   // 클라이언트에서 서버로 토큰을 전달하는 방식  (header, querystring, body 등이 있다.)
//   // header 의 경우 다음과 같이 써야 한다 { key: 'Authorization', value: 'JWT' + 토큰
//   //jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt")
//   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
// };

// // database
// var mysql = require('mysql');
// var dbconfig = require('../config/database.js');
// var connection = mysql.createConnection(dbconfig);

// module.exports = function () {
//   var strategy = new Strategy(params, function (payload, done) {
//     // TODO write authentications to find users from a database
//     // var user = users.find(function (u) {
//     //   return u.id === payload.id;
//     // });



    
//     console.log("payload");
//     console.log(payload.sub);

//     connection.query('SELECT * FROM USERS WHERE `email`=?', [payload.id], function(err, rows){
//         var user = rows[0];

//         if (user) {
//           console.log("done")
//             return done(null, user);
//         } else {
//           console.log("not done")
//             return done(new Error('User not found'), null);
//         }
//     });



    
//   });
//   console.log("auth init 1");
//   passport.use('jwt', strategy);

//   console.log("auth init 2");

//   return {
//     initialize: function () {
//         console.log("auth initialize!");
//         //passport.use('jwt', strategy);
//         return passport.initialize();
//     },
//     authenticate: function (req, res, next) {
//         console.log("auth authenticate!");
//         return passport.authenticate('jwt', cfg.jwtSession);
//     }, 
//   };
// };



// module.exports = {
//     isAuthenticated : function(req, res, next){
//       console.log('isAuthenticated');  
//       console.log(req.isAuthenticated());
//         if(req.isAuthenticated())
//             return next();
//         res.redirect('/member/login');
//     }
// }