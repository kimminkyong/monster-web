var express = require('express');
var router = express.Router();

var jwt = require('jwt-simple');
var auth = require('./auth');

var mysql = require('mysql');
var dbconfig = require('../../config/database.js');
var connection = mysql.createConnection(dbconfig);
var docbarCate = "favorite";

/* 좋아요 리스트 */

function getFavoriteList(req, res, next){
    var userEmail = req.user.email;
    var existQuery='SELECT * FROM FAVORITE_LIST WHERE EMAIL="'+userEmail+'" ';
    connection.query(existQuery, function(err, rows){
        if(err) throw err;
        if(rows[0]){
            req.favoriteList = rows;
        }else{
            res.send( "<script type='text/javascript'>alert('좋아요 종목이 없습니다.');location.href='/m/product';</script>" );
        }
        next();
    });

}

function itemDetailList(req, res, next){
    var userEmail = req.user.email;
    var qs = 'SELECT m.*, t.name, n.date as today_date, n.close as today_close, n.change_per as today_per, f.add_date as favorite_add_date from MA01 m JOIN TOTAL_STOCK_CODE t ON m.code = t.code JOIN today_stock_info n ON n.code = m.code LEFT OUTER JOIN FAVORITE_LIST f ON m.code=f.code AND m.date=f.find_date WHERE f.email="'+userEmail+'" AND m.date =f.find_date AND m.code =f.code ';

    connection.query(qs, function(err, rows) {
        if(err) throw err;
        req.rowList = rows;
        console.log(req.rowList);
        next();
    });
}

function itemList_PageRender(req, res){

    res.render('m/favorite/item_list', {
        title: 'ITEM-LIST',
        docCate : docbarCate,
        user:req.user,
        rowList : req.rowList,
    });
}


router.get("/", auth.check, /*getFavoriteList, */itemDetailList, itemList_PageRender);







/* POST */
router.post('/add_item', auth.check, function(req, res) {
    var q_code = req.body.f_code;
    var q_fdate = req.body.f_date;
    var q_email = req.body.f_email;
    var q_adate = req.body.f_now;
    
    var st_query = "INSERT INTO FAVORITE_LIST (code, find_date, email, add_date, etc) VALUES ( '"+q_code+"', '"+q_fdate+"', '"+q_email+"' ,'"+q_adate+"', ' ')";
    connection.query(st_query, function(err, rows){
        if(rows){
            res.send("<script type='text/javascript'>alert('좋아요에 등록되었습니다!');</script>");
        }else{
            res.send("");
        }
    });
});

router.post('/remove_item', auth.check, function(req, res) {
    var q_code = req.body.f_code;
    var q_fdate = req.body.f_date;
    var q_email = req.body.f_email;
    
    var st_query = "DELETE FROM FAVORITE_LIST WHERE code = '"+q_code+"' AND find_date = '"+q_fdate+"' AND email = '"+q_email+"' ";
    connection.query(st_query, function(err, rows){
        if(rows){
            res.send("<script type='text/javascript'>alert('좋아요에서 삭제되었습니다!');</script>");
        }else{
            res.send('');
        }
    });
});

module.exports = router;
