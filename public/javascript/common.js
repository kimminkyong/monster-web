function AddComma(data_value) {
    return Number(data_value).toLocaleString('en').split(".")[0];    
}


$(document).ready(function(){

    // $("a.panel_link").click(function(){
    //     // var targetLink = $(this).attr("data");
    //     // var target=$(".box-wrap");
    //     // var param_h = $(window).height();
    //     // var fakePanel = "<div class='fake_panel' style='positon:absolute;top:0px;width:0px;height:"+param_h+"px'></div>";
    //     // target.append(fakePanel);
    //     // target.find(".fake_panel").css({"display":"block","right":"0px"}).animate({"width":"100%"}, 200, function(){
    //     //     setTimeout(function(){target.find(".fake_panel").remove()}, 500);
    //     //     location.href = targetLink;
    //     // });



    //     var targetLink = $(this).attr("data");
    //     $(".box-wrap").animate({"left":"-100%"}, 200, function(){
    //         setTimeout(function(){ $(".box-wrap").css({"left":"0px"}); }, 500);
    //         location.href = targetLink;
    //     })
    //     return false;

    // });
})




