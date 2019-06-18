var jwt = require('jsonwebtoken');
var cfg = require('../../config/jwt_config');
var sha256 = require('sha256');

var validator = require('validator');
var exValidator = require('express-validator');

var mysql = require('mysql');
var dbconfig = require('../../config/database.js');
var connection = mysql.createConnection(dbconfig);



exports.login = (req, res, next) => {
  var email = req.body.email;
  var password = req.body.password;
  var secret = cfg.jwtSecret;

  connection.query('SELECT * FROM USERS WHERE `email`=?', [email], function(err, rows){
    var user = rows[0];
    console.log(user);

    if( typeof(user) == "undefined" ){
      res.send(
        "<script type='text/javascript'>alert('사용자가 존재하지 않습니다');history.back();</script>"
      );
    }else{
      var pw = sha256( password + email );

      if(user.password === pw ){
        var token = jwt.sign({
          email: user.email,
          nick: user.nick
        }, secret, { expiresIn: '6h', issuer: 'monster.com', subject: 'userToken'}
        );
        console.log(token);
        res.cookie('token', token, { expires: new Date(Date.now() + (900000*6)), httpOnly: true });
        next();
      }else{
        res.send(
          "<script type='text/javascript'>alert('비밀번호가 일치하지 않습니다');history.back();</script>"
        )
      }
    }
    
            
            
            
  });

}

exports.register = (req, res, next) => {

  req.check('name', '사용자 ID를 입력해 주세요.').exists();
  req.check('email', '이메일 주소를 입력해 주세요.').exists();
  req.check('password', '비밀번호를 입력해 주세요.').exists();
  req.check('email', '이메일 주소가 올바르지 않습니다.').isEmail();
  req.check('password', '비밀번호는 8자리 이상 입력해 주세요.').isLength({ min: 8 });

  var errors = req.validationErrors();

  function specialCharRemove(str){ 
    var str = str;
    var regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi

    if(regExp.test(str)){
        str = str.replace(regExp, "")
    }
    return str;
  }

  if (errors){
      console.log(errors[0].msg);
      var msg = errors[0].msg;
      res.send(
        "<script type='text/javascript'>alert('"+msg+"');history.back();</script>"
      );
  }else{
      console.log(req.body.email);
      connection.query('SELECT * FROM USERS WHERE `email`=?', [req.body.email], function(err, rows){

          if(rows.length > 0){
              res.send(
                "<script type='text/javascript'>alert('동일한 이메일 존재합니다.');history.back();</script>"
              );
          }else{
              var q_email = req.body.email;
              var q_nick = q_email.split("@")[0];
              var q_name = req.body.name;
                  q_name = specialCharRemove( q_name );
              var q_password = sha256( req.body.password + q_email );
              var q_birth = req.body.birth;
              var q_phone = req.body.phoneNum;
              var q_type = 'E';
              var q_grade = '1';
              var nowdate = new Date(Date.now()).toISOString().replace(/T/, ' ').replace(/\..+/, '');

              var st_query = "INSERT INTO USERS (nick, password, name, email, phone, birthday, type, grade, register_date, last_join_date, etc) VALUES ( '"+q_nick+"', '"+q_password+"', '"+q_name+"' ,'"+q_email+"' ,'"+q_phone+"' ,'"+q_birth+"' ,'"+q_type+"' ,'"+q_grade+"', '"+nowdate+"', '"+nowdate+"', ' ')";
              connection.query(st_query, function(err, rows){
                  if(rows){
                      console.log("회원정보 저장 성공!");
                      next();
                  }else{
                      console.log("회원정보 저장 오류!");
                      console.log(err);
                  }
              });
              
          }
      });
      

      
  }
}


exports.check = (req, res, next) => {
    var token = req.cookies.token;
    console.log(token);
    if(token){
      jwt.verify(token, cfg.jwtSecret, function(err, decoded) {
          if(err) {
              console.log(err);
              //res.redirect('/member/login');
          }else{
              console.log(decoded.email);
              req.user = decoded;
              next();
          }
      });
    }else{
      res.redirect('/m/user/login');
    }

  
}

exports.logout = (req, res, next) => {
  res.clearCookie("token");
  next();
};

