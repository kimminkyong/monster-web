var emailValiable = false;
var emailDoubleValiable = false;
var pw1Valiable = false;
var pw2Valiable = false;
var nameValiable = false;
var birthValiable = false;
var telValiable = false;
var telConfirmValiable = false;
var nowPanel = 1;

function ableBtnCheck(){
	if(emailValiable && emailDoubleValiable && pw1Valiable && pw2Valiable){
		$("#btnNext").removeClass("disable");
	}else{
		$("#btnNext").addClass("disable");
		console.log("no disabled");
	}

}

function ableBtnCheck2(){
	if(nameValiable && birthValiable && telValiable && telConfirmValiable){
		$("#btnReg").removeClass("disable");
	}else{
		$("#btnReg").addClass("disable");
		console.log("no disabled");
	}

}

function panelChange(){
		var mv = (nowPanel ==1 )? "-100%" : "0%";
		var pnt = (nowPanel ==1 )? "(2/2)" : "(1/2)";

		$(".reg_step_wrap > .inner").animate({"left":mv}, 500, function(){
			$("#stepTxt").empty().html(pnt);
			if(nowPanel ==1 ){nowPanel = 2}else{nowPanel =1 }
		});
}

function isCellPhone(p) {
	p = p.split('-').join('');
	var regPhone = /^((01[1|6|7|8|9])[1-9]+[0-9]{6,7})|(010[1-9][0-9]{7})$/;
	return regPhone.test(p);
}


function chkEmail(str) {
		var regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
		if (regExp.test(str)) return true;
		else return false;
}
function emailDoubleCheck(str){
	var ins_email =  str;
	var val;

	$.ajax({
			async: false,
			type : 'POST',
			data : {"email":ins_email},
			url : "/m/user/emailexist",
			dataType : "json",
			success : function(data) {
					if (data.cnt > 0) {
							val = false;
					} else {
							val = true;
					}
			},
			error : function(error) {
				val = false;
			}
	});
	return val;
}

function checkEmailReg(){
	var msg = "";
	var rFlag = true;
	var checkVal = $("#email").val();
	var checkBtn = $("#ckEmail")
	
	if( chkEmail(checkVal) ){
			emailValiable = true;
			console.log("중복체크 시작");
			if( emailDoubleCheck(checkVal) ){
					msg = "사용가능한 이메일입니다"
					rFlag = true;
					emailDoubleValiable = true;
					checkBtn.addClass("hide");
			}else{
					msg = "이메일이 이미 존재합니다.";
					rFlag = false;
			}
	}else{
			msg = "이메일 형식에 맞지 않습니다."
			rFlag = false;
	}
	showFormResult("ckEmail", msg, rFlag);
	ableBtnCheck();
}

function showFormResult(idName, msg, flag){
	console.log(msg);
	var cls = (flag) ? "msg_t" : "msg_f";
	var target = $("#"+idName+"").parents(".group");
	var dom = "<p class='msg "+cls+"'>"+msg+"</p>";
	target.find(".msg").remove();
	target.append(dom);
}

//생년월일 유효성 체크
function isValidDate(dateStr) {
	var year = Number(dateStr.substr(0,4)); 
	var month = Number(dateStr.substr(4,2));
	var day = Number(dateStr.substr(6,2));
	var today = new Date(); // 날자 변수 선언
	var yearNow = today.getFullYear();
	var adultYear = yearNow-20;
	var msg = "";
    var rFlag = false;


	if (year < 1900 || year > adultYear){
		msg = "년도를 확인하세요. "+adultYear+"년생 이전 출생자만 등록 가능합니다.";
		rFlag = false;
		showFormResult("birth", msg, rFlag);
		birthValiable = false;
	}else if (month < 1 || month > 12) { 
		msg = "달은 1월부터 12월까지 입력 가능합니다.";
		rFlag = false;
		showFormResult("birth", msg, rFlag);
		birthValiable = false;
	}else if (day < 1 || day > 31) {
		msg = "일은 1일부터 31일까지 입력가능합니다.";
		rFlag = false;
		showFormResult("birth", msg, rFlag);
		birthValiable = false;
	}else if ((month==4 || month==6 || month==9 || month==11) && day==31) {
		msg = month+"월은 31일이 존재하지 않습니다.";
		rFlag = false;
		showFormResult("birth", msg, rFlag);
		birthValiable = false;
	}else if (month == 2) {
		var isleap = (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0));
		if (day>29 || (day==29 && !isleap)) {
			msg = year + "년 2월은  " + day + "일이 없습니다.";
			rFlag = false;
			showFormResult("birth", msg, rFlag);
			birthValiable = false;
		 }
	}else{
		msg = "유효한 생년월일 입니다.";
		rFlag = true;
		showFormResult("birth", msg, rFlag);
		birthValiable = true;
	}
}








function init(){
	var ww = $(".reg_step_wrap").width();
	$(".reg_step_wrap").css({"height":$(".reg_step_wrap").find(".reg_step").eq(1).height()+"px"});
	$(".reg_step_wrap > .inner").css({"width":(ww*2)+"px"});
	$(".reg_step").css({"width":ww+"px"});
}