var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var dbconfig = require('../../config/database.js');
var connection = mysql.createConnection(dbconfig);

var auth = require('../admin/auth');

/* GET home page. */
function showPageRender(req, res){
  res.render('admin/chart-view', {
    title: 'chart-view',
    user:req.user,

  });
}

router.get('/chart', auth.check, showPageRender );


module.exports = router;
