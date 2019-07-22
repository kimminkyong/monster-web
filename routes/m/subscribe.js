var express = require('express');
var router = express.Router();

var jwt = require('jwt-simple');
var auth = require('./auth');

var mysql = require('mysql');
var dbconfig = require('../../config/database.js');
var connection = mysql.createConnection(dbconfig);
var docbarCate = "subscribe";

/************************************ 알고리즘 리스트 ************************************/
function checkProductBuyData(req, res, next){
    var userEmail = req.user.email;
    var existQuery='SELECT NO FROM BUYING_ALGORITHM WHERE EMAIL="'+userEmail+'" ';
    connection.query(existQuery, function(err, rows){
        if(err) throw err;
        if(rows[0]){
            req.buyList = rows;
        }else{
            res.send( "<script type='text/javascript'>alert('구독중인 상품이 없습니다.');location.href='/m/product';</script>" );
        }
        next();
    });

}

function getProductMyList(req, res, next){

    var buyListArray = req.buyList.map(function(el){return el.NO});
    console.log(buyListArray);

    var findQuery='SELECT * FROM ALGORITHM_LIST WHERE `code` IN ("'+buyListArray+'") ';
    console.log(findQuery);
    connection.query(findQuery, function(err, rows){
        if(err) throw err;
        if(rows){ req.prdList = rows; }
        next();
    });
}

router.get("/", auth.check, checkProductBuyData, getProductMyList, function(req, res) {
    res.render('m/subscribe/alg_list', { 
        title: 'alg_list',
        docCate : docbarCate,
        dataList : req.prdList
    });
});


/************************************ 일별 리스트 ************************************/
function getAlgorithmName(req, res, next){
    var kindAlgorithm = ( req.query.prd ) ? req.query.prd: "000010";
    connection.query('SELECT * from ALGORITHM_LIST WHERE `code`=?', [kindAlgorithm], function(err, rows) {
        if(err) throw err;
        req.algorithmName = rows[0].nick_name+"_daily_list";
        req.cName = rows[0].col_name;
        next();
      });
}

function getDailyList(req, res, next){
    var reqMonth =  ( req.query.month ) ? req.query.month : new Date().getMonth()+1;
    var reqYear = new Date().getFullYear();
    var reqFullMonth = ("0"+reqMonth).slice(-2);
    var startDate = reqYear+"-"+reqFullMonth+"-01";
    var endDate = reqYear+"-"+reqFullMonth+"-31";

    var algorithmName = req.algorithmName;
    console.log(algorithmName);
    req.thisYear = reqYear;
    req.thisMonth = reqMonth;
    req.sumItem = 0;
    queryColumn = req.cName;
    console.log(queryColumn)

    connection.query('SELECT SUM('+queryColumn+') as total from `'+algorithmName+'` WHERE date BETWEEN "'+startDate+'" AND "'+endDate+'" ORDER BY date DESC', function(err, rows) {
        if(err) throw err;
        req.sumItem = rows[0].total;
    }); 

    connection.query('SELECT date, `'+queryColumn+'` from `'+algorithmName+'` WHERE date BETWEEN "'+startDate+'" AND "'+endDate+'" ORDER BY date DESC', function(err, rows) {
        if(err) throw err;
        req.dailyList = rows;
        console.log(rows);
        next();
    });  
}


router.get("/daily_list", auth.check, getAlgorithmName, getDailyList, function(req, res){
    res.render('m/subscribe/daily_list', {
        title: 'DAILY-LIST',
        docCate : docbarCate,
        dailyList : req.dailyList,
        thisYear : req.thisYear,
        thisMonth : req.thisMonth,
        thisTotal : req.sumItem
    });
});





















/* 종목별 리스트 */
function findStep2ItemLength(req, res, next){
    var dateParam = req.query.date;
    var s2Length='SELECT count(*) as total from MA01 WHERE date="'+dateParam+'" and alg_step="step2"';
    connection.query(s2Length, function(err, rows) {
        if(err) throw err;
        req.step2Length = rows[0].total;
        next()
    });
}


function itemDetailList(req, res, next){
    var dateParam = req.query.date;
    var qs='SELECT * from MA01 JOIN TOTAL_STOCK_CODE ON MA01.code = TOTAL_STOCK_CODE.code WHERE MA01.date="'+dateParam+'"';
    connection.query(qs, function(err, rows) {
        if(err) throw err;
        req.step1Length = rows.length;
        req.rowList = rows;
        next();
    });
}

function itemList_PageRender(req, res){

    res.render('m/subscribe/item_list', {
        title: 'ITEM-LIST',
        docCate : docbarCate,
        user:req.user,
        rowList : req.rowList,
        listDate : req.query.date, 
        step1_length: req.step1Length,
        step2_length: req.step2Length
    });
}

router.get("/item-list", auth.check, findStep2ItemLength, itemDetailList, itemList_PageRender);





/* 알고리즘 안내 및 구매 */

function algBuy_PageRender(req, res){



    res.render('m/subscribe/alg-buy', {
        title: 'ALGORITHM BUY',
        docCate : docbarCate,
        user:req.user,
        prd_number : req.query.prd
    });
}


router.get("/alg-buy", auth.check, algBuy_PageRender);

/* 알고리즘 구매하기 */
router.post("/alg-buy", auth.check, function(req, res) {
    function getNowDatetime(){
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;
        return dateTime;
    }
    console.log("알고리즘 구매하기");
    var q_email = req.body.email;
    var q_prdNo = req.body.prd_no;
    var q_nowdate = getNowDatetime();


    var st_query = "INSERT INTO BUYING_ALGORITHM (NO, EMAIL, DATE_BUY) VALUES ( '"+q_prdNo+"', '"+q_email+"', '"+q_nowdate+"')";
    connection.query(st_query, function(err, rows){
        if(err) throw err;
        if(rows){
            res.send(
                "<script type='text/javascript'>alert('성공적으로 구매되었습니다.\\n감사합니다!');location.href='/m/subscribe/daily-list?prd="+q_prdNo+"';</script>"
            );
        }else{
            res.send(
                "<script type='text/javascript'>alert('죄송합니다.\\n구매 중 오류가 발생하였습니다.\\n관라자에게 문의해 주세요.');location.href='/m/subscribe/alg-buy'</script>"
            );
        }
    });
});

/* POST */
router.post('/', auth.check, function(req, res) {
    res.json({
        message: 'mobile main'
    })
});

module.exports = router;
