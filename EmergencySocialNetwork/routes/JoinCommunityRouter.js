var express = require('express');
var myParser = require("body-parser");
var router = express.Router();
var app = express();
var JoinCommunityCtrl = require('./controller/JoinCommunityCtrl.js');

app.use(myParser.urlencoded({extended : true}));

app.get('/', function(req,res) {

    res.sendFile('。/views/index.html');

})
router.post('/login', JoinCommunityCtrl.LoginCommunity)
router.post('/login/confirmed', JoinCommunityCtrl.AddUser);
router.get('/userlist', JoinCommunityCtrl.ListUser);

module.exports = router;
var server = app.listen(8081, function () {
var host = server.address().address
var port = server.address().port
console.log("Example app listening at http://%s:%s", host, port)
})