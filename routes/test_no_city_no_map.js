var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('test_no_city_no_map', {  });
});

module.exports = router;
