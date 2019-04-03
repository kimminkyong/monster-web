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

router.get('/detail-view/:code', function(req, res, next){
  var dateParam = req.params.code;
  var daily_stock_info = "";

  conn_sci.query('SELECT * from `'+dateParam+'` ORDER BY date DESC LIMIT 30', function(err, rows) {
    if(err) throw err;
    // res.render('index', { title: 'Express', a01LogList : rows });
    daily_stock_info = rows;
    
    console.log(daily_stock_info);
    res.render('detail-view', { 
      title: 'ITEM DETAIL VIEW', 
      dailyStockInfo : daily_stock_info
    });

  });
  
  

})


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
