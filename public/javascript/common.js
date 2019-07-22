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
    }
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




