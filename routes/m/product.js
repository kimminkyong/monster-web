var express = require('express');
var router = express.Router();

var jwt = require('jwt-simple');
var auth = require('./auth');

var mysql = require('mysql');
var dbconfig = require('../../config/database.js');
var connection = mysql.createConnection(dbconfig);
var docbarCate = "product";

/* 상품 리스트 */

function getProductList(req, res, next){
    var findQuery='SELECT * FROM ALGORITHM_LIST';
    connection.query(findQuery, function(err, rows){
        if(err) throw err;
        if(rows){
            req.prdList = rows;
        }
        console.log(req.prdList);
        next();
    })
}


router.get("/", auth.check, getProductList, function(req, res) {

    
    res.render('m/product/prd_list', { 
        title: 'PRODUCT-LIST',
        docCate : docbarCate,
        dataList : req.prdList
    });
});

/* 상품소개 페이지 */

function productViewRender(req, res){

    res.render('m/product/prd_view', {
        title: 'PRODUCT-INTRODUCE',
        docCate : docbarCate,
        user:req.user,
        prd_number : req.query.prd
    });
}
router.get("/prd_view", auth.check, productViewRender);


/* 상품 구매하기 */

function checkProductBuyData(req, res, next){
    var q_email = req.body.email;
    var q_prdNo = req.body.prd_no;
    var existQuery='SELECT * FROM BUYING_ALGORITHM WHERE EMAIL="'+q_email+'" and NO="'+q_prdNo+'"';
    connection.query(existQuery, function(err, rows){
        if(err) throw err;
        console.log(rows[0])
        if(rows[0]){
            res.send( "<script type='text/javascript'>alert('이미 구독중인 상품입니다!');location.href='/m/product/prd_view?prd="+q_prdNo+"';</script>" );
        }else{
            next();
        }
    });

}

function insertProductBuyData(req, res, next){
    function getNowDatetime(){
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;
        return dateTime;
    }
    console.log("상품 구매하기");
    var q_email = req.body.email;
    var q_prdNo = req.body.prd_no;
    var q_nowdate = getNowDatetime();    
    var st_query = "INSERT INTO BUYING_ALGORITHM (NO, EMAIL, DATE_BUY) VALUES ( '"+q_prdNo+"', '"+q_email+"', '"+q_nowdate+"')";
    connection.query(st_query, function(err, rows){
        if(err) throw err;
        if(rows){
            res.send( "<script type='text/javascript'>alert('성공적으로 구매되었습니다.\\n감사합니다!');location.href='/m/product/prd_view?prd="+q_prdNo+"';</script>" );
        }else{
            res.send( "<script type='text/javascript'>alert('죄송합니다.\\n구매 중 오류가 발생하였습니다.\\n관라자에게 문의해 주세요.');location.href='/m/product/prd_view?prd="+q_prdNo+"'</script>" );
        }
    });
}

router.post("/prd_buy", auth.check, checkProductBuyData, insertProductBuyData, function(req, res) {
    

});









module.exports = router;
