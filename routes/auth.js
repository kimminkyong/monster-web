module.exports = {
    isAuthenticated : function(req, res, next){
      console.log('isAuthenticated');  
      console.log(req.isAuthenticated());
        if(req.isAuthenticated())
            return next();
        res.redirect('/member/login');
    }
}