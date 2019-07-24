var express = require('express');
var router = express.Router();

var jwt = require('jwt-simple');
var auth = require('./auth');

var mysql = require('mysql');
var dbconfig = require('../../config/database.js');
var connection = mysql.createConnection(dbconfig);
var docbarCate = "notice";


/* 알고리즘 리스트 */
router.get("/", auth.check, function(req, res) {
    
    res.render('m/notice/list', { 
        title: 'notice_list',
        docCate : docbarCate
    });
    
});




module.exports = router;
