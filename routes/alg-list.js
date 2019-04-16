var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var dbconfig = require('../config/database.js');
var db_sci = require('../config/db_sci.js');
var connection = mysql.createConnection(dbconfig);
var conn_sci = mysql.createConnection(db_sci);


function ma01DailyList(req, res, next){
  connection.query('SELECT * from MA01_daily_list ORDER BY date DESC', function(err, rows) {
    if(err) throw err;
    // res.render('index', { title: 'Express', a01LogList : rows });
    req.ma01DailyList = rows
    console.log(rows);
    next();
  });

}

function showPageRender(req, res){
  res.render('alg-daily-list', {
    title: 'ALGORITHM-DAILY-LIST',
    ma01DailyList : req.ma01DailyList
  });
}

router.get('/ma01', ma01DailyList, showPageRender );





function dvStep1(req, res, next){
  connection.query('SELECT name from TOTAL_STOCK_CODE WHERE code="'+req.params.code+'"', function(err, rows) {
    if(err) throw err;
    req.codeName = rows[0].name;
    next();
  });
  
}

function dvStep2(req, res, next){
  conn_sci.query('SELECT * from `'+req.params.code+'` ORDER BY date DESC LIMIT 45', function(err, rows) {
    if(err) throw err;
    req.daily_stock_info = rows;
    next();
  });
}

function dvRender(req, res){
  res.render('detail-view', { 
    title: 'ITEM DETAIL VIEW', 
    dailyStockInfo : req.daily_stock_info,
    listCodeName : req.codeName,
    listCode : req.params.code
  });
}


router.get('/detail-view/:code', dvStep1, dvStep2, dvRender );



function tdvStep1(req, res, next){
  connection.query('SELECT name from TOTAL_STOCK_CODE WHERE code="'+req.params.code+'"', function(err, rows) {
    if(err) throw err;
    req.codeName = rows[0].name;
    next();
  });
  
}

function tdvStep2(req, res, next){
  conn_sci.query('SELECT * from `'+req.params.code+'` ORDER BY date DESC LIMIT 45', function(err, rows) {
    if(err) throw err;
    req.daily_stock_info = rows;
    next();
  });
}

function tdvRender(req, res){
  res.render('tracking-view', { 
    title: 'ITEM TRACKING VIEW', 
    dailyStockInfo : req.daily_stock_info,
    listCodeName : req.codeName,
    listCode : req.params.code,
    listDate : req.params.date
  });
}

router.get('/tracking-view/:code/:date', tdvStep1, tdvStep2, tdvRender );




/* GET home page. */
router.get('/ma01/:date', function(req, res, next) {
    var itemTotalLength = 0;
    var step1Length = 0;
    var step2Length = 0;
    var dateParam = req.params.date;

    var totalLength='SELECT count(*) as total from TOTAL_STOCK_CODE';
    connection.query(totalLength, function(err, rows) {
      if(err) throw err;
      itemTotalLength = rows[0].total;
    });

    var s2Length='SELECT count(*) as total from MA01 WHERE date="'+dateParam+'" and alg_step="step2"';
    connection.query(s2Length, function(err, rows) {
      if(err) throw err;
      step2Length = rows[0].total;
    });


    var qs='SELECT * from MA01 JOIN TOTAL_STOCK_CODE ON MA01.code = TOTAL_STOCK_CODE.code WHERE MA01.date="'+req.params.date+'"';
    connection.query(qs, function(err, rows) {
      if(err) throw err;
      step1Length = rows.length;
      res.render('alg-list', { 
        title: 'ALGORITHM LIST', 
        rowList : rows,
        listDate : req.params.date, 
        total_item_length: itemTotalLength,
        step1_length: step1Length,
        step2_length: step2Length
      });
      console.log('The solution is: ', rows);
    });

    console.log('mysql connect completed!!');

});


module.exports = router;
