function AddComma(data_value) {
    return Number(data_value).toLocaleString('en').split(".")[0];    
}

var isMain = false;

function initHeaderMenu(){
    //alert(isMain);
    if(isMain){
        $("#headerMenuBtn").removeClass("icon-back").addClass("icon-menu");
    }
    

}

function findDocbarIndex(){
    if( $("#dock").hasClass("main") ){
        return 0;
    }else if( $("#dock").hasClass("product") ){
        return 1;
    }else if( $("#dock").hasClass("subscribe") ){
        return 2;
    }else if( $("#dock").hasClass("favorite") ){
        return 3;
    }else if( $("#dock").hasClass("notice") ){
        return 4;
    }
}

function getToday(){
    var getYear = new Date().getFullYear();
    var getMonth = new Date().getMonth()+1;
    var getDay = new Date().getDate();
    var returnDate = "";
    getMonth = (String(getMonth).length < 2) ? "0"+getMonth : getMonth;
    returnDate = getYear+"-"+getMonth+"-"+getDay;
    return returnDate;
}

function docbarSet(){
    var docbarIdx = findDocbarIndex();
    $("#dock").find("li > a").removeClass("on");
    if(docbarIdx){
        $("#dock").find("li").eq(docbarIdx).children("a").addClass("on");
    }else{
        $("#dock").find("li").eq(0).children("a").addClass("on");
    }

}

function getWeekName(dateString) {
    var dateStr = (dateString) ? dateString : null;
    var week = new Array('Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat');
    
    var today = new Date(dateStr).getDay();
    var todayLabel = week[today];
    
    return todayLabel;
}

function getShotDate(dateString) {
    function zeroCheck(str){
        var re_str = str.split("");
        if(re_str[0] == "0"){
            return re_str[1];
        }else{
            return str;
        }
    }
    var shotDateString = "";
    var dateStr = dateString.split("-");
    var monStr = zeroCheck(dateStr[1]);
    var dayStr = zeroCheck(dateStr[2]);
    shotDateString = monStr+"."+dayStr;
    
    return shotDateString;
}


$(document).ready(function(){
    initHeaderMenu();//헤더 메뉴 or 뒤로가기 셋팅

    $("#headerMenuBtn").on("click", function(){
        if( $(this).hasClass("icon-back") ){
            history.back();
        }else{
            console.log("menu open");
        }
        return false;
    });

    docbarSet();


})




