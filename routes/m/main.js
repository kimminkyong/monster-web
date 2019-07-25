var express = require('express');
var router = express.Router();

var jwt = require('jwt-simple');
var auth = require('../m/auth');

var mysql = require('mysql');
var dbconfig = require('../../config/database.js');
var connection = mysql.createConnection(dbconfig);
var docbarCate = "main";
/* GET */
router.get("/", auth.check, function(req, res) {
    console.log(req.user);
    res.render('m/main', { 
        title: 'MAIN',
        user : req.user,
        docCate : docbarCate
     });
    
});


/* GET */
router.post('/', auth.check, function(req, res) {
    res.json({
        message: 'mobile main'
    })
});

module.exports = router;
