var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var dbconfig = require('../config/database.js');
var connection = mysql.createConnection(dbconfig);

var auth = require('./auth');

/* GET home page. */
function showPageRender(req, res){
  res.render('chart-view', {
    title: 'chart-view',
    user:req.user,

  });
}

router.get('/chart', auth.isAuthenticated, showPageRender );


module.exports = router;
