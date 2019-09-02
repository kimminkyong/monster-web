var express = require('express');
var router = express.Router();
var util     = require('./util');

var jwt = require('jsonwebtoken');
var cfg = require('../../config/jwt_config');

var mysql = require('mysql');
var dbconfig = require('../../config/database.js');
var connection = mysql.createConnection(dbconfig);


// create
router.post('/register', function(req,res,next){
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
    if(!req.body.name){
        isValid = false;
        validationError.errors.name = {message:'Name is required!'};
    }
    if(!req.body.phone){
        isValid = false;
        validationError.errors.phone = {message:'Phone is required!'};
    }

    if(!isValid) return res.json(util.successFalse(validationError));
    else next();

}, function(req, res, next){

    connection.query('SELECT * FROM USERS WHERE `email`=?', [req.body.email], function(err, rows){
        if(err) return res.json(util.successFalse(err));
        
        if(rows.length > 0){
            return res.json(util.successFalse(null,'이미 사용중인 이메일 주소입니다.'));
        }else{
            var q_email = req.body.email;
            var q_nick = q_email.split("@")[0];
            var q_name = req.body.name;
                q_name = util.specialCharRemove( q_name );
            var q_password = sha256( req.body.password + q_email );
            var q_birth = req.body.birth;
            var q_phone = req.body.phone;
            var q_type = 'E';
            var q_grade = '1';
            var nowdate = new Date(Date.now()).toISOString().replace(/T/, ' ').replace(/\..+/, '');
        
            var st_query = "INSERT INTO USERS (nick, password, name, email, phone, birthday, type, grade, register_date, last_join_date, etc) VALUES ( '"+q_nick+"', '"+q_password+"', '"+q_name+"' ,'"+q_email+"' ,'"+q_phone+"' ,'"+q_birth+"' ,'"+q_type+"' ,'"+q_grade+"', '"+nowdate+"', '"+nowdate+"', ' ')";
            
            connection.query(st_query, function(err, rows){
                res.json(err||!rows? util.successFalse(err): util.successTrue(rows));
            });  
        }
    });

});

// email check
router.get('/:email', util.isLoggedin, function(req,res,next){
    var req_email = req.params.username;
    connection.query('SELECT * FROM USERS WHERE `email`=?', [req_email], function(err, rows){
        if(err) return res.json(util.successFalse(err));
        
        if(rows.length > 0){
            return res.json(util.successFalse(null,'이미 사용중인 이메일 주소입니다.'));
        }else{
            res.json( util.successTrue(rows));
        }
    });


});




















module.exports = router;