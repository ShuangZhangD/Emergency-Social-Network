var express = require('express');
var myParser = require("body-parser");
var app = express();
var JoinCommunityCtrl = require('./controller/JoinCommunityCtrl.js');

app.use(myParser.urlencoded({extended : true}));

app.get('/', function(req,res) {
    res.sendFile(__dirname+'/views/index.html');
})
app.post('/login', JoinCommunityCtrl.LoginCommunity)
app.post('/login/confirmed', JoinCommunityCtrl.AddUser);
app.get('/userlist', JoinCommunityCtrl.ListUser);


var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})
