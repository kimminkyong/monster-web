var express = require('express');
var router = express.Router();
var util     = require('./util');
var sha256 = require('sha256');

var jwt = require('jsonwebtoken');
var cfg = require('../../config/jwt_config');

var mysql = require('mysql');
var dbconfig = require('../../config/database.js');
var connection = mysql.createConnection(dbconfig);


// login
router.post('/login',
    function(req,res,next){
        var isValid = true;
        var validationError = {
            name:'ValidationError',
            errors:{}
        };

        if(!req.body.email){
            isValid = false;
            validationError.errors.email = {message:'Email is required!'};
        }
        if(!req.body.password){
            isValid = false;
            validationError.errors.password = {message:'Password is required!'};
        }

        if(!isValid) return res.json(util.successFalse(validationError));
        else next();
    },
    function(req,res,next){
        var email = req.body.email;
        var password = req.body.password;
        var secret = cfg.jwtSecret;

        connection.query('SELECT * FROM USERS WHERE `email`=?', [email], function(err, rows){
            var user = rows[0];
            if(err) return res.json(util.successFalse(err));
            if( typeof(user) == "undefined" ){
                return res.json(util.successFalse(null,'Username or Password is invalid'));
            }else{
                var pw = sha256( password + email );

                if(user.password === pw ){
                    var token = jwt.sign({
                        email: user.email,
                        nick: user.nick
                        }, secret, { expiresIn: '24h', issuer: 'monster.com', subject: 'userToken'}
                    );
                    return res.json(util.successTrue(token));
                    //next();
                }else{
                    return res.json(util.successFalse(null,'Password is not collect'));
                }       
            }
         
        });

    }
);

router.post('/email_login',
    function(req,res,next){
        var isValid = true;
        var validationError = {
            name:'ValidationError',
            errors:{}
        };

        if(!req.body.email){
            isValid = false;
            validationError.errors.email = {message:'Email is required!'};
        }
        if(!req.body.password){
            isValid = false;
            validationError.errors.password = {message:'Password is required!'};
        }
        if(!isValid) return res.json(util.successFalse(validationError));
        else next();
    },
    function(req,res,next){
        var email = req.body.email;
        var password = req.body.password;
        var secret = cfg.jwtSecret;

        connection.query('SELECT * FROM USER WHERE `email`=?', [email], function(err, rows){
            var user = rows[0];
            if(err) return res.json(util.successFalse(err));
            if( typeof(user) == "undefined" ){
                return res.json(util.successFalse(null,'Username or Password is invalid'));
            }else{
                var pw = sha256( password + email );

                if(user.password === pw ){
                    var token = jwt.sign({
                        email: user.email,
                        name: user.name
                        }, secret, { expiresIn: '24h', issuer: 'stockzine.co.kr', subject: 'userToken'}
                    );
                    //로그인 시 고객 정보에 token 값 업데이트 
                    var update_token_query = "UPDATE USER SET token = '"+token+"' WHERE email = '"+user.email+"' ";
                    connection.query( update_token_query, function(err, rows){
                        return res.json(err || !rows ? util.successFalse(err): util.successTrue(token));
                    }); 
                    //res.json(util.successTrue(token));
                    //next();
                }else{
                    return res.json(util.successFalse(null,'Password is not collect'));
                }       
            }
         
        });

    }
);

// find password
router.post('/email_certified', function(req,res,next){
    var req_email = req.body.email;
    var req_type = "c";
    util.sendEmail(req_email, req_type);
}); 


// me
router.get('/me', util.isLoggedin,
    function(req,res,next) {
        var email = req.decoded.email;
        connection.query('SELECT * FROM USERS WHERE `email`=?', [email], function(err, rows){
          var user = rows[0];
          if(err||!user) return res.json(util.successFalse(err));
          res.json(util.successTrue(user));
        });
    }
);

// refresh
router.get('/refresh', util.isLoggedin,
    function(req,res,next) {
        var email = req.decoded.email;
        connection.query('SELECT * FROM USERS WHERE `email`=?', [email], function(err, rows){
            var user = rows[0];
            var secret = cfg.jwtSecret;
            if(err||!user) return res.json(util.successFalse(err));
            else {
                var token = jwt.sign({
                    email: user.email,
                    nick: user.nick
                    }, secret, { expiresIn: '24h', issuer: 'monster.com', subject: 'userToken'}
                );
                res.json(util.successTrue(token));
            }
        });

    }
);

module.exports = router;