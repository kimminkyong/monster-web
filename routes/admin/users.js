var express = require('express');
var router = express.Router();

var auth = require('../admin/auth');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;