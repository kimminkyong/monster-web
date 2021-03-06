var express = require('express');
var router = express.Router();

var jwt = require('jwt-simple');
var auth = require('../admin/auth');

var mysql = require('mysql');
var dbconfig = require('../../config/database.js');
var connection = mysql.createConnection(dbconfig);
//var MobileDetect = require('mobile-detect')

var passport = require('passport');
const {check, validationResult} = require('express-validator/check');

/* GET home page. */

function monsterA01Log(req, res, next){
  connection.query('SELECT * from monster_log WHERE log_kind="a01_log" ORDER BY date DESC LIMIT 10', function(err, rows) {
    if(err) throw err;
    // res.render('index', { title: 'Express', a01LogList : rows });
    req.a01LogList = rows
    //console.log(rows);
    next();
  });

}

function monsterCodeLog(req, res, next){
  connection.query('SELECT * from monster_log WHERE log_kind="d_log" ORDER BY date DESC  LIMIT 10', function(err, rows) {
    if(err) throw err;
    // res.render('index', { title: 'Express', a01LogList : rows });
    req.codeLogList = rows
    //console.log(rows);
    next();
  });

}

function ma01DailyList(req, res, next){
  connection.query('SELECT * from MA01_daily_list ORDER BY date DESC LIMIT 10', function(err, rows) {
    if(err) throw err;
    // res.render('index', { title: 'Express', a01LogList : rows });
    req.ma01DailyList = rows;
    req.ma01DailyList_day = rows[0].date;
    req.ma01DailyList_len = rows[0].step2;
    //console.log(rows);
    next();
  });

}

function countTotalStock(req, res, next){
  connection.query('SELECT count(*) as total from TOTAL_STOCK_CODE', function(err, rows) {
    if(err) throw err;
    req.totalStockLength = AddComma(rows[0].total);
    //console.log(rows);
    next();
  });

}

function AddComma(data_value) {
  return Number(data_value).toLocaleString('en').split(".")[0];
}

function monsterToday(){
  var d = new Date();
  var v_y = d.getFullYear();
  var v_m = d.getMonth()+1;
  var v_d = d.getDate();
  var dateSt = String(v_y)+"."+String(v_m)+"."+String(v_d);
  return dateSt;
}
function monsterTodayWeek(){
  var d = new Date();
  var txt_w = ['일','월','화','수','목','금','토']
  var v_d = d.getDay();
  var dateWt = txt_w[v_d]+"요일";
  return dateWt;
}

function showPageRender(req, res){
  //모바일 접속 확인 
  //var md = new MobileDetect(req.headers['user-agent']);
  //console.log(md.mobile());
  console.log("user session check!");
  console.log(req.user);
  //console.log(req.session.passport);

 
    res.render('admin/index', {
      title: 'MONSTER',
      user:req.user,
      a01LogList: req.a01LogList,
      codeLogList: req.codeLogList,
      totalStockCount: req.totalStockLength,
      ma01DailyList : req.ma01DailyList,
      ma01DailyList_day : req.ma01DailyList_day,
      ma01DailyList_len : req.ma01DailyList_len,
      monster_today : monsterToday(),
      monster_today_week : monsterTodayWeek()
    });

}

router.get('/secret', auth.check, function (req, res) {
  res.send(req.user);
});

function checkAuth(req, res, next){
  console.log("user")
  console.log(req.user);


  next()
  
  
}
router.get('/', auth.check, monsterA01Log, monsterCodeLog, countTotalStock, ma01DailyList, showPageRender );



//router.get('/',checkAuth, auth.authenticate(), monsterA01Log, monsterCodeLog, countTotalStock, ma01DailyList, showPageRender );

//router.post('/', auth.isAuthenticated, monsterA01Log, monsterCodeLog, countTotalStock, ma01DailyList, showPageRender );
function formCheck(req, res, next){
  var errors = validationResult(req);
  console.log("formCheck");
  console.log(req.body);
  if (!errors.isEmpty()) {
    return res.status(422).jsonp(errors.array());
  } else {
    //res.send({});
    next();
  }
  
}

router.post('/',formCheck, passport.authenticate('local', {
  successRedirect:'/',
  failureRedirect:'/member/login'
  //,failureFlash:true
}));

module.exports = router;
