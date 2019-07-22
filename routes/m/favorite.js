var express = require('express');
var router = express.Router();

var jwt = require('jwt-simple');
var auth = require('./auth');

var mysql = require('mysql');
var dbconfig = require('../../config/database.js');
var connection = mysql.createConnection(dbconfig);
var docbarCate = "favorite";

/* 좋아요 리스트 */
router.get("/", auth.check, function(req, res) {
    
    res.render('m/favorite/item_list', { 
        title: 'favorite_list',
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
