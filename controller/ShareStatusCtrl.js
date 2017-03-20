/**
 * Created by keqinli on 3/18/17.
 */
var express = require('express');
var myParser = require("body-parser");

var dboper = require("../models/ShareStatusDBoper");
var app = express();

class ShareStatusController {
    AddShareStatus(req, res){
        var info = req.body;
        var username = info["username"];
        var status=info["emergencystatus"];

        //update database through ShareStatusDBoper.addsharestatus
        dboper.Updatesharestatus(username, emergencystatus, function (err, results) {
            if (err) {
                console.log('Error:'+ err);
                res.json({success:0, err_type: 1, err_msg:"Database Error"});
            } else {
                res.json({success:1, suc_msg: "Success"});
            }});
    }
    //
    UpdateShareStatusSocket(socket){
        return function(data) {
            socket.emit('Update Share Status', data);
            socket.broadcast.emit('Update Share Status', data);
        };
    }
}

let ssc = new ShareStatusController();

module.exports = {
    AddShareStatus : ssc.AddShareStatus,
    UpdateShareStatusSocket : ssc.UpdateShareStatusSocket
}