var express = require('express');
var router = express.Router();

var jwt = require('jwt-simple');
var auth = require('./auth');

var mysql = require('mysql');
var dbconfig = require('../../config/database.js');
var connection = mysql.createConnection(dbconfig);
var docbarCate = "mypage";


/* mypage view */
router.get("/", auth.check, function(req, res) {
    
    res.render('m/mypage/mypage', { 
        title: 'mypage',
        user:req.user,
        docCate : docbarCate
    });
    
});




/* POST */
router.post('/', auth.check, function(req, res) {
    res.json({
        message: 'mobile main'
    })
});

module.exports = router;
