var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var dbconfig = require('../config/database.js');
var connection = mysql.createConnection(dbconfig);

/* GET home page. */
router.get('/:date', function(req, res, next) {
    //connection.connect((err) =>{
        // if(err){
        //   console.log(err)
        //   return
        // }

        connection.query('SELECT * from MA01 WHERE date="'+req.params.date+'"', function(err, rows) {
          if(err) throw err;
          res.render('alg-list', { title: 'ALGORITHM LIST', rowList : rows ,listDate:req.params.date});
          console.log('The solution is: ', rows);
        });

        console.log('mysql connect completed!!');
    // });
    // connection.end();
});


module.exports = router;
