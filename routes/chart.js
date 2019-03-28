var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var dbconfig = require('../config/database.js');
var connection = mysql.createConnection(dbconfig);



/* GET home page. */
function showPageRender(req, res){
  res.render('chart-view', {
    title: 'chart-view',

  });
}

router.get('/chart',  showPageRender );


module.exports = router;
