var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var dbconfig = require('../config/database.js');
var connection = mysql.createConnection(dbconfig);

/* GET home page. */

function monsterA01Log(req, res, next){
  connection.query('SELECT * from monster_log WHERE log_kind="a01_log" ORDER BY date DESC', function(err, rows) {
    if(err) throw err;
    // res.render('index', { title: 'Express', a01LogList : rows });
    req.a01LogList = rows
    console.log(rows);
    next();
  });

}

function monsterCodeLog(req, res, next){
  connection.query('SELECT * from monster_log WHERE log_kind="d_log" ORDER BY date DESC', function(err, rows) {
    if(err) throw err;
    // res.render('index', { title: 'Express', a01LogList : rows });
    req.codeLogList = rows
    console.log(rows);
    next();
  });

}


function showPageRender(req, res){
  res.render('index', {
    title: 'Express',
    a01LogList: req.a01LogList,
    codeLogList: req.codeLogList
  });
}

router.get('/', monsterA01Log, monsterCodeLog, showPageRender );
  //res.render('index', { title: 'Express' });



  // connection.query('SELECT * from monster_log WHERE log_kind="a01_log" ORDER BY date DESC', function(err, rows) {
  //   if(err) throw err;
  //   res.render('index', { title: 'Express', a01LogList : rows });
  //   console.log(rows);
  // });








module.exports = router;
