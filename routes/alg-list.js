var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var dbconfig = require('../config/database.js');
var connection = mysql.createConnection(dbconfig);

/* GET home page. */
router.get('/:date', function(req, res, next) {
  //res.render('alg-list', { title: 'ALGORITHM LIST', rows: rows });
  connection.connect((err) =>{
    if(err){
      console.log(err)
      return
    }
    console.log('mysql connect completed');
  })
  
  connection.query('SELECT * from MA01 WHERE date="'+req.params.date+'"', function(err, rows) {
    console.log(req.params.date);
    if(err) throw err;
    res.render('alg-list', { title: 'ALGORITHM LIST', rowList : rows ,listDate:req.params.date});
    console.log('The solution is: ', rows);
    //res.send(rows);
    //res.render('alg-list', { title: rows });
  });

});


module.exports = router;
