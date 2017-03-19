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
        var status=info["status"];

        //update database through ShareStatusDBoper.addsharestatus
        dboper.Updatesharestatus(username, status, function (err, results) {
            if (err) {
                console.log('Error:'+ err);
                res.json({success:0, err_type: 1, err_msg:"Database Error"});
            } else {
                res.json({success:1, suc_msg: "Success"});
            }});
    }
}

let ssc = new ShareStatusController();

module.exports = {
    AddShareStatus : ssc.AddShareStatus
}