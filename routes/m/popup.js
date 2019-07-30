var express = require('express');
var router = express.Router();

var jwt = require('jwt-simple');
var auth = require('./auth');

var mysql = require('mysql');
var dbconfig = require('../../config/database.js');
var connection = mysql.createConnection(dbconfig);
var docbarCate = "popup";


/* 차트보기 */
router.get("/chart", auth.check, function(req, res) {
    var prd_code = req.query.code;
    res.render('m/popup/chart', { 
        title: 'Chart View',
        code : prd_code,
        docCate : docbarCate
    });
    
});




module.exports = router;
