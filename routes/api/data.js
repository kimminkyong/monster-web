var express = require('express');
var router = express.Router();
var util     = require('./util');
var sha256 = require('sha256');

var jwt = require('jsonwebtoken');
var cfg = require('../../config/jwt_config');

var mysql = require('mysql');
var dbconfig = require('../../config/database.js');
var connection = mysql.createConnection(dbconfig);


var userConfig = require('../../config/stockzine.js');
var userConnection = mysql.createConnection(userConfig);

//accessAllow
router.post('/get_alg_list',
    function(req,res,next) {
        connection.query('SELECT * FROM ALGORITHM_LIST ORDER BY id', function(err, rows){
            var algList = rows;
            if(err||!algList) return res.json(util.successFalse(err));
            return algList;
        });
    }
);

router.post('/updownDay5',
    function(req,res,next) {
        var code = req.body.algCode;
        connection.query('SELECT * FROM MONSTER_UPDOWN WHERE `code`=? ORDER BY date', [code], function(err, rows){
            var algList = rows;
            if(err||!algList) return res.json(util.successFalse(err));
            return algList;
        });
    }
);

router.post('/month_alg_list',
    function(req,res,next) {
        var code = req.body.algCode;
        var month = req.body.month;
        var year = req.body.month;
        var reqMonth =  ( month ) ? month : new Date().getMonth()+1;
        var reqYear =  ( year ) ? year : new Date().getFullYear();
        var reqFullMonth = ("0"+reqMonth).slice(-2);
        var startDate = reqYear+"-"+reqFullMonth+"-01";
        var endDate = reqYear+"-"+reqFullMonth+"-31";

        connection.query('SELECT mu.*, mc..* FROM MONSTER_UPDOWN AS mu JOIN MONSTER_CALENDAR AS mc ON mu.date=mc.date WHERE `code`=? AND date BETWEEN "'+startDate+'" AND "'+endDate+'" ORDER BY date', [code], function(err, rows){
            var algList = rows;
            if(err||!algList) return res.json(util.successFalse(err));
            return algList;
        });
    }
);

router.post('/get_my_alg_list',
    function(req,res,next) {
        userConnection.query('SELECT * FROM USER_ALGORITHM WHERE `email`=? ORDER BY NO', function(err, rows){
            var myAlgList = rows;
            if(err||!myAlgList) return res.json(util.successFalse(err));
            return myAlgList;
        });
    }
);




// // login
// router.post('/email_login',
//     function(req,res,next){
//         var isValid = true;
//         var validationError = {
//             name:'ValidationError',
//             errors:{}
//         };

//         if(!req.body.email){
//             isValid = false;
//             validationError.errors.email = {message:'Email is required!'};
//         }
//         if(!req.body.password){
//             isValid = false;
//             validationError.errors.password = {message:'Password is required!'};
//         }

//         if(!isValid) return res.json(util.successFalse(validationError));
//         else next();
//     },
//     function(req,res,next){
//         var email = req.body.email;
//         var password = req.body.password;
//         var secret = cfg.jwtSecret;

//         connection.query('SELECT * FROM USER WHERE `email`=?', [email], function(err, rows){
//             var user = rows[0];
//             if(err) return res.json(util.successFalse(err));
//             if( typeof(user) == "undefined" ){
//                 return res.json(util.successFalse(null,'Username or Password is invalid'));
//             }else{
//                 var pw = sha256( password + email );

//                 if(user.password === pw ){
//                     var accessToken = jwt.sign({
//                         email: user.email,
//                         nick: user.nick
//                         }, secret, { expiresIn: '24h', issuer: 'stockzine.co.kr', subject: 'accessToken'}
//                     );
//                     var refreshToken = jwt.sign({
//                         email: user.email,
//                         nick: user.nick
//                         }, secret, { expiresIn: '7d', issuer: 'stockzine.co.kr', subject: 'refreshToken'}
//                     );

//                     connection.query('UPDATE USER SET `token`=? WHERE `email`=?', [refreshToken, user.email], function(err, rows){
//                         if(err) return res.json(util.successFalse(err));
//                         if( typeof(user) == "undefined" ){
//                             return res.json(util.successFalse(null,'UserToken can not update!'));
//                         }else{
//                             return res.json(util.successTrue(accessToken));
//                             //next();
//                         }
//                     }); 
//                 }else{
//                     return res.json(util.successFalse(null,'Password is not collect'));
//                 }       
//             }
         
//         });

//     }
// );

// router.post('/sns_login',
//     function(req,res,next){
//         var isValid = true;
//         var validationError = {
//             name:'ValidationError',
//             errors:{}
//         };

//         if(!req.body.email){
//             isValid = false;
//             validationError.errors.email = {message:'Email is required!'};
//         }
//         if(!req.body.password){
//             isValid = false;
//             validationError.errors.password = {message:'Password is required!'};
//         }
//         if(!isValid) return res.json(util.successFalse(validationError));
//         else next();
//     },
//     function(req,res,next){
//         var email = req.body.email;
//         var password = req.body.password;
//         var secret = cfg.jwtSecret;

//         connection.query('SELECT * FROM USER WHERE `email`=?', [email], function(err, rows){
//             var user = rows[0];
//             if(err) return res.json(util.successFalse(err));
//             if( typeof(user) == "undefined" ){
//                 return res.json(util.successFalse(null,'Username or Password is invalid'));
//             }else{
//                 var pw = sha256( password + email );

//                 if(user.password === pw ){
//                     var token = jwt.sign({
//                         email: user.email,
//                         name: user.name
//                         }, secret, { expiresIn: '24h', issuer: 'stockzine.co.kr', subject: 'userToken'}
//                     );
//                     //로그인 시 고객 정보에 token 값 업데이트 
//                     var update_token_query = "UPDATE USER SET token = '"+token+"' WHERE email = '"+user.email+"' ";
//                     connection.query( update_token_query, function(err, rows){
//                         return res.json(err || !rows ? util.successFalse(err): util.successTrue(token));
//                     }); 
//                     //res.json(util.successTrue(token));
//                     //next();
//                 }else{
//                     return res.json(util.successFalse(null,'Password is not collect'));
//                 }       
//             }
         
//         });

//     }
// );

// router.post('/email_register', function(req,res,next){
//     var isValid = true;
//     var validationError = {
//         name:'ValidationError',
//         errors:{}
//     };

//     if(!req.body.email){
//         isValid = false;
//         validationError.errors.email = {message:'Email is required!'};
//     }
//     if(!req.body.password){
//         isValid = false;
//         validationError.errors.password = {message:'Password is required!'};
//     }
    
//     if(!isValid) return res.json(util.successFalse(validationError));
//     else next();

// }, function(req, res, next){

//     connection.query('SELECT * FROM USER WHERE `email`=?', [req.body.email], function(err, rows){
//         if(err) return res.json(util.successFalse(err));
        
//         if(rows.length > 0){
//             return res.json(util.successFalse(null,'이미 사용중인 이메일 주소입니다.'));
//         }else{
//             var q_id = util.uuid();
//             var secret = cfg.jwtSecret;
//             var q_email = req.body.email;
//             var q_name = q_email.split("@")[0];
//             var q_password = sha256( req.body.password + q_email );
//             var q_photo = "";
//             var q_phone = "";
//             var r_token = jwt.sign({
//                 email: q_email,
//                 name: q_name
//                 }, secret, { expiresIn: '7d', issuer: 'stockzine.co.kr', subject: 'refreshToken'}
//             );
//             var a_token = jwt.sign({
//                 email: q_email,
//                 name: q_name
//                 }, secret, { expiresIn: '24h', issuer: 'stockzine.co.kr', subject: 'accessToken'}
//             );
//             var q_type = "E";
//             var q_grade = 0;
//             var q_state = "J";
//             var q_push ="N";
//             var nowdate = new Date(Date.now()).toISOString().replace(/T/, ' ').replace(/\..+/, '');
        
//             var user_query = "INSERT INTO USER (id, email, password, token) VALUES ( '"+q_id+"','"+q_email+"', '"+q_password+"', '"+r_token+"');";

//             var user_detail_query = "INSERT INTO USER_DETAIL (id, name, photo, phone, type, grade, state, push, date) VALUES ( '"+q_id+"', '"+q_name+"' ,'"+q_photo+"' ,'"+q_phone+"' ,'"+q_type+"' ,'"+q_grade+"' ,'"+q_state+"', '"+q_push+"', '"+nowdate+"');";
//             connection.query(user_query + user_detail_query, function(err, rows){
//                 var makeRow ={};
//                 makeRow.email = q_email;
//                 makeRow.token = a_token;
//                 res.json(err || !rows[0] || !rows[1] ? util.successFalse(err): util.successTrue(makeRow));
//             });  
//         }
//     });

// });

// // find password
// router.post('/email_certified', function(req,res,next){
//     var req_email = req.body.email;
//     var obj = {};
//     var num6 = Math.floor(Math.random() * 1000000)+100000;
//     if(num6 > 1000000){ num6 = num6 - 100000; }
    
//     obj.type = "c";
//     obj.certifyNumber = num6;

//     var certify_query = "INSERT INTO USER_CERTIFY (email, number) VALUES ( '"+req_email+"','"+obj.certifyNumber+"');";

//     connection.query(certify_query, function(err, rows){
//         if(err) return res.json(util.successFalse(err));
//         else {
//           	util.sendEmail(req_email, obj);
// 		return res.json( util.successTrue(true) );
//         }
//     }); 

    
// }); 

// // accessAllow
// router.post('/tokenCheck', util.accessTokenCheck,
//     function(req,res,next) {
//         var email = req.decoded.email;
//         connection.query('SELECT * FROM USER WHERE `email`=?', [email], function(err, rows){
//             var user = rows[0];
//             if(err||!user) return res.json(util.successFalse(err));
//             var tokenCertify = util.refreshTokenCheck(user.token);
//             var secret = cfg.jwtSecret;
//             if(tokenCertify){
//                 var token = jwt.sign({
//                     email: user.email,
//                     nick: user.nick
//                     }, secret, { expiresIn: '24h', issuer: 'monster.com', subject: 'userToken'}
//                 );
//                 return res.json(util.successTrue(token));
//             }else{
//                 return res.json(util.successFalse(err));
//             }
//         });
//     }
// );

// // me
// router.get('/me', util.isLoggedin,
//     function(req,res,next) {
//         var email = req.decoded.email;
//         connection.query('SELECT * FROM USERS WHERE `email`=?', [email], function(err, rows){
//           var user = rows[0];
//           if(err||!user) return res.json(util.successFalse(err));
//           res.json(util.successTrue(user));
//         });
//     }
// );

// // refresh
// router.get('/refresh', util.isLoggedin,
//     function(req,res,next) {
//         var email = req.decoded.email;
//         connection.query('SELECT * FROM USERS WHERE `email`=?', [email], function(err, rows){
//             var user = rows[0];
//             var secret = cfg.jwtSecret;
//             if(err||!user) return res.json(util.successFalse(err));
//             else {
//                 var token = jwt.sign({
//                     email: user.email,
//                     nick: user.nick
//                     }, secret, { expiresIn: '24h', issuer: 'monster.com', subject: 'userToken'}
//                 );
//                 res.json(util.successTrue(token));
//             }
//         });

//     }
// );

module.exports = router;
