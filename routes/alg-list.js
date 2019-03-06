var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var dbconfig = require('../config/database.js');
var connection = mysql.createConnection(dbconfig);

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('alg-list', { title: 'ALGORITHM LIST', rows: rows });
  
  connection.query('SELECT * from MA01 WHERE date=`2019-02-18`', function(err, rows) {
    if(err) throw err;
    res.render('alg-list', { title: 'ALGORITHM LIST', row : rows });
    console.log('The solution is: ', rows);
    //res.send(rows);
    //res.render('alg-list', { title: rows });
  });

});


module.exports = router;
