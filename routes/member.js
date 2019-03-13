var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var dbconfig = require('../config/database.js');
var connection = mysql.createConnection(dbconfig);

/* GET home page. */
router.get('/login', function(req, res, next) {
    res.render('login', { title: 'LOGIN'});

      
});


module.exports = router;
