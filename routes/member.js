var express = require('express');
var router = express.Router();

var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var auth = require('./auth');

var validator = require('validator');
var exValidator = require('express-validator');
var sha256 = require('sha256');

var mysql = require('mysql');
var dbconfig = require('../config/database.js');
var connection = mysql.createConnection(dbconfig);

/* GET home page. */
router.get('/login', function(req, res, next) {
    console.log(req.user);
    if(req.user){
        res.redirect('/');
    }else{
        res.render('login', { title: 'LOGIN'});
    }


      
});

router.get('/logout', function(req, res, next) {
    console.log('logout');
    req.logout();
    res.redirect('/member/login');


      
});

router.get('/wait', function(req, res, next) {
    console.log('wait');

    res.render('wait', { 
        title: 'WAIT'
    });

      
});

router.get('/rigister', function(req, res, next) {
    console.log(req.user);
    req.session.errors=[];
    if(req.user){
        res.redirect('/');
    }else{
        res.render('rigister', { 
            title: 'RIGISTER',
            success:false,
            errors:req.session.errors
        });
    }


      
});

router.post('/rigister', function(req, res, next) {
    console.log("post rigister!");
 
    // console.log(req.body.username);
    // console.log(validator.isEmail(req.body.email))
    
    req.check('username', '사용자 ID를 입력해 주세요.').exists();
    req.check('email', '이메일 주소를 입력해 주세요.').exists();
    req.check('password', '비밀번호를 입력해 주세요.').exists();
    req.check('email', '이메일 주소가 올바르지 않습니다.').isEmail();
    req.check('password', '비밀번호는 8자리 이상 입력해 주세요.').isLength({ min: 8 });

    var errors = req.validationErrors();
    if (errors){
        req.session.errors= errors;
        res.redirect('/member/rigister');
    }else{
        console.log(req.body.email);
        connection.query('SELECT * FROM USERS WHERE `email`=?', [req.body.email], function(err, rows){
            console.log(rows);
            console.log(rows.length);
            if(rows.length > 0){
                req.session.errors= "동일한 이메일 있음";
                console.log("동일한 이메일 있음");
                res.redirect('/member/rigister');
            }else{
                var nowdate = new Date(Date.now()).toLocaleString();
                var email = req.body.email;
                //email = email.replace("@",".dot.");
                var pw = sha256( req.body.password + req.body.email );
                var st_query = "INSERT INTO USERS (user_id, password, nick, email, type, grade, register_date, last_join_date, etc) VALUES ( '"+req.body.username+"', '"+pw+"', '"+req.body.username+"' ,'"+email+"', 'L', '1', '"+nowdate+"', '"+nowdate+"', ' ')";
                connection.query(st_query, function(err, rows){
                    if(rows){
                        console.log("회원정보 저장 성공!");
                        res.redirect('/member/login');
                    }else{
                        console.log("회원정보 저장 오류!");
                        console.log(err);
                    }
                });
                
            }
        });
        

        
    }
    
});

// function kmk(req, res, next){
//     passport.serializeUser(function(user, done){
//   console.log("serializeUser");
//   done(null, user.user_id);
// });
// passport.deserializeUser(function(user_id, done){
//   console.log("deserializeUser");
//   console.log(user_id);
//   connection.query('SELECT * FROM USERS WHERE `user_id`=?', [user_id], function(err, rows){
//     var user = rows[0];
//     console.log(user);
//     done(err, user);
//   });

// });
// next();
// }

// router.post('/login',kmk ,passport.authenticate('local', {
//   successRedirect:'/',
//   failureRedirect:'/member/login'
//   //,failureFlash:true
// }));


module.exports = router;
