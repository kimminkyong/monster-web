var express = require('express');
var router = express.Router();

var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var auth = require('../m/auth');
var cfg = require('../../config/jwt_config');
var jwt = require('jwt-simple');


var validator = require('validator');
var exValidator = require('express-validator');
var sha256 = require('sha256');

var mysql = require('mysql');
var dbconfig = require('../../config/database.js');
var connection = mysql.createConnection(dbconfig);

var nodemailer = require('nodemailer');
var sendmail = require('sendmail')();

/* GET home page. */
router.get('/login', function(req, res, next) {
    console.log(req.user);
    if(req.user){
        res.redirect('/');
    }else{
        res.render('m/login', { title: 'LOGIN'});
    }    
});


router.post('/emailexist', function (req, res) {
    var email = req.body.email;

    connection.query('SELECT * FROM USERS WHERE `email`=?', [email], function(err, rows){
        console.log("query");
        console.log(rows.length);
        res.send({cnt:rows.length});

    });
});

router.post('/login', auth.login, function (req, res) {
    res.redirect('/m');
});



router.get('/logout', auth.logout, function(req, res, next) {
    res.redirect('/m/user/login');

});



router.get('/register', function(req, res, next) {
    console.log(req.user);
    if(req.user){
        res.redirect('/');
    }else{
        res.render('m/register', { 
            title: 'RIGISTER'
        });
    }


      
});

router.post('/register', auth.register, function(req, res, next) {
    res.redirect('/m/user/welcome');
    
});

router.get('/find', function(req,res,next){
    res.render('m/find', {
        title:"FIND",
        find_email:""
    });
})

router.post('/find', function(req,res,next){
    console.log(req.body.name)
    console.log(req.body.phoneNum)   

    var name = req.body.name;
    var phone = req.body.phoneNum;
    var findEmail = "";

    connection.query('SELECT * FROM USERS WHERE `name`=? AND `phone`=?', [name, phone], function(err, rows){
        console.log("query");
        console.log(rows[0].email);
        findEmail = rows[0].email;

    });
    
    res.render('m/find', {
        title:"FIND",
        find_email:findEmail
    });
})

router.post('/sendMail', function(req,res,next){
    var req_email = req.body.email;
    // var transporter = nodemailer.createTransport({
    //     service:'gmail',
    //     auth: {
    //         user : 'mk2monster1572@gmail.com',
    //         pass : 'kmk9972026324'
    //     }
    // });

    // var transporter = nodemailer.createTransport("SMTP", {
    //     host: "stockzine.co.kr",
    //     port: 25
    // });
    
    // var mailOption = {
    //     from : 'stockzine.co.kr',
    //     to : req_email,
    //     subject : 'STOCKZINE 비밀번호 변경 메일입니다.',
    //     text : 'Hello'
    // };
    
    // transporter.sendMail(mailOption, function(err, info) {
    //     if ( err ) {
    //         console.error('Send Mail error : ', err);
    //     }
    //     else {
    //         console.log('Message sent : ', info);
    //     }
    // });

    sendmail({
        from: 'master@stockzine.co.kr',
        to: req_email,
        subject: 'test sendmail',
        html: 'Mail of test sendmail ',
      }, function(err, reply) {
        console.log(err && err.stack);
        console.dir(reply);
    });

    var findEmail = "";
    
    res.render('m/find', {
        title:"FIND",
        find_email:findEmail
    });
})

router.get('/welcome', function(req, res, next) {
    res.render('m/welcome', { 
        title: 'WELCOME'
    });
    
});


module.exports = router;
