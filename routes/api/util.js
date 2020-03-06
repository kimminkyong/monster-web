// var express = require('express');
// var router = express.Router();

var jwt = require('jsonwebtoken');
var uuid4 = require('uuid4');
var cfg = require('../../config/jwt_config');
var sendmail = require('sendmail')();

var util = {};

util.uuid = function(){
  var uid = uuid4().split('-');
  var uuid = uid[2]+uid[1]+uid[0]+uid[3]+uid[4];
  return uuid;
};

util.sendEmail = function(to,type){
    var receiver = to;
    var sendType = type;
    var r_subject = "";
    var r_text = "";

    var uid = uuid4().split('-');
    var uuid = uid[2]+uid[1]+uid[0]+uid[3]+uid[4];
    var certificationText = uuid.substring(0,6);

    if(sendType === "f"){
      r_subject = "STOCKZINE 임시 비밀번호 입니다.";
      r_text = "안녕하십니까? STOCKZINE 입니다.\n 아래의 임시 비밀번호를 입력해 주세요.\n["+certificationText+"]";
    }else if(sendType === "c"){
      r_subject = "STOCKZINE 인증문자 입니다.";
      r_text = "안녕하십니까? STOCKZINE 입니다.\n 아래의 인증 문자를 입력해 주세요.\n["+certificationText+"]";
    }

    sendmail({
        from: 'master@stockzine.co.kr',
        to: receiver,
        subject: r_subject,
        html: r_text,
    }, function(err, reply) {
        console.log(err && err.stack);
        if(err) return res.json(util.successFalse(err));
        else{
          return res.json(util.successTrue(certificationText));;
        }
    });
}

util.successTrue = function(data){ //1 
  return {
    success:true,
    message:null,
    errors:null,
    data:data
  };
};

util.successFalse = function(err, message){ //2
  if(!err&&!message) message = 'data not found';
  return {
    success:false,
    message:message,
    errors:(err)? util.parseError(err): null,
    data:null
  };
};

util.parseError = function(errors){ //3
  var parsed = {};
  if(errors.name == 'ValidationError'){
    for(var name in errors.errors){
      var validationError = errors.errors[name];
      parsed[name] = { message:validationError.message };
    }
  } else if(errors.code == '11000' && errors.errmsg.indexOf('username') > 0) {
    parsed.username = { message:'This username already exists!' };
  } else {
    parsed.unhandled = errors;
  }
  return parsed;
};


// middlewares
util.isLoggedin = function(req,res,next){ //4
  var token = req.headers['x-access-token'];
  if (!token) return res.json(util.successFalse(null,'token is required!'));
  else {
    jwt.verify(token, cfg.jwtSecret, function(err, decoded) {
      if(err) return res.json(util.successFalse(err));
      else{
        req.decoded = decoded;
        next();
      }
    });
  }
};


util.specialCharRemove = function(str){ 
  var str = str;
  var regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi

  if(regExp.test(str)){
      str = str.replace(regExp, "")
  }
  return str;
};

module.exports = util;