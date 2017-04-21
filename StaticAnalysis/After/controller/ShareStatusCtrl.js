/**
 * Created by keqinli on 3/18/17.
 */
"use strict";

var dboper = require("../models/ShareStatusDBoper");
var DBConfig = require("./DBConfig");
let dbconfig = new DBConfig();
var url = dbconfig.getURL();

class ShareStatusController {

    AddShareStatus(req, res){
        var info = req.body;
        var username = info["username"];
        var status=info["emergencystatus"];
        //update database through ShareStatusDBoper.updatesharestatus
        dboper.Updatesharestatus(username, status, url, function (err, results) {
            if (err) {
                // console.log("Error:"+ err);
                res.json({success:0, err_type: 1, err_msg:results});
            }
            else {
                res.json({success:1, suc_msg: "Success"});
            }
        });
    }

    GetShareStatus(req, res){
        var info=req.body;
        var username = info["username"];
        username = req.params.username;
        dboper.Getsharestatus(username, url, function(err, results){
            if(err) {
                // console.log("Error:" +err);
                res.json({success:0, err_type: 1, err_msg:"Database Error"});
            }
            else {
                res.json({success:1, data: results});
            }
        });
    }

    UpdateShareStatusSocket(socket){
        return function(data) {
            socket.emit("Update Share Status", data);
            socket.broadcast.emit("Update Share Status", data);
        };
    }
}

let ssc = new ShareStatusController();

module.exports = {
    AddShareStatus : ssc.AddShareStatus,
    GetShareStatus : ssc.GetShareStatus,
    UpdateShareStatusSocket : ssc.UpdateShareStatusSocket
};
