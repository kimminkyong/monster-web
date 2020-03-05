var express = require('express');
var router = express.Router();
var util     = require('./util');
var sha256 = require('sha256');

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
    
    if(!isValid) return res.json(util.successFalse(validationError));
    else next();

}, function(req, res, next){

    connection.query('SELECT * FROM USER WHERE `email`=?', [req.body.email], function(err, rows){
        if(err) return res.json(util.successFalse(err));
        
        if(rows.length > 0){
            return res.json(util.successFalse(null,'이미 사용중인 이메일 주소입니다.'));
        }else{
            var q_id = util.uuid();
            var q_email = req.body.email;
            var q_name = q_email.split("@")[0];
                //q_name = util.specialCharRemove( q_name );
            var q_password = sha256( req.body.password + q_email );
            var q_photo = "";
            var q_phone = "";
            var q_token = "abcdefg";
            var q_type = 'E';
            var q_grade = 1;
            var q_state = 0;
            var q_push =0;
            var nowdate = new Date(Date.now()).toISOString().replace(/T/, ' ').replace(/\..+/, '');
        
            var user_query = "INSERT INTO USER (id, email, password, token) VALUES ( '"+q_id+"','"+q_email+"', '"+q_password+"', '"+q_token+"')";

            var user_detail_query = "INSERT INTO USER_DETAIL (id, name, photo, phone, type, grade, state, push, date) VALUES ( '"+q_id+"', '"+q_name+"' ,'"+q_photo+"' ,'"+q_phone+"' ,'"+q_type+"' ,'"+q_grade+"' ,'"+q_state+"', '"+q_push+"', '"+nowdate+"')";

            
            connection.query(user_query + user_detail_query, function(err, rows){
                res.json(err || !rows[0] || !rows[1] ? util.successFalse(err): util.successTrue(rows));
            });  
        }
    });

});

// email check
router.get('/:email', function(req,res,next){
    var req_email = req.params.email;
    //return res.json(util.successFalse(null,req_email));
    
    connection.query('SELECT * FROM USER WHERE `email`=?', [req_email], function(err, rows){
        if(err) return res.json(util.successFalse(err));
        
        if(rows.length > 0){
            return res.json(util.successFalse(null,'이미 사용중인 이메일 주소입니다.'));
        }else{
            res.json( util.successTrue(rows));
        }
    });
});

// find email
router.get('/:name/:phone', function(req,res,next){
    var req_name = req.params.name;
    var req_phone = req.params.phone;
    
    connection.query('SELECT * FROM USERS WHERE `name`=? AND `phone`=?', [req_name, req_phone], function(err, rows){
        var user = rows[0];
        if(err||!user) return res.json(util.successFalse(err));
        res.json(util.successTrue(user));
    });
});




















module.exports = router;