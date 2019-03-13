var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var dbconfig = require('../config/database.js');
var connection = mysql.createConnection(dbconfig);

/* GET home page. */
router.get('/:date', function(req, res, next) {
    var itemTotalLength = 0;
    var step1Length = 0;
    var step2Length = 0;

    var totalLength='SELECT count(*) as total from TOTAL_STOCK_CODE';
    connection.query(totalLength, function(err, rows) {
      if(err) throw err;
      itemTotalLength = rows[0].total;
    });

    var s2Length='SELECT count(*) as total from MA01 WHERE alg_step="step2"';
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
