/**
 * Created by shuang on 2/26/17.
 */
"use strict";

var dboper = require("../models/PublicChatDBoper.js");
var DBConfig = require("./DBConfig");
let dbconfig = new DBConfig();
var url = dbconfig.getURL();

class PublicChatCtrl{

    AddPublicMessage (req, res) {
        var info = req.body;
        var message = info["pubmsg"];
        var sender = info["username"];
        var emergencystatus = info["emergencystatus"];
        dboper.InsertMessage(sender, "", message, "public", Date.now(),emergencystatus, url, function (err, results) {
            if (err) {
                // console.log("Error:"+ err);
                res.json({success:0, err_type: 1, err_msg:results});
            } else {
                res.json({success:1, suc_msg: "Success"});
            }
        });
    }

    publicMessageSocket (socket) {
        return function(data) {
            socket.emit("Public Message", data);
            socket.broadcast.emit("Public Message", data);
        };
    }
    LoadPublicMessage (req, res){
        dboper.LoadPublicMessage(url, function (err, results) {
            if (err) {
                // console.log("Error:"+ err);
                res.json({success:0, err_type: 1, err_msg:results});
            } else {

                res.json({success:1, data: results});
            }
        });
    }

}

let pubtrl = new PublicChatCtrl();
module.exports={
    AddPublicMessage: pubtrl.AddPublicMessage,
    publicMessageSocket: pubtrl.publicMessageSocket,
    LoadPublicMessage: pubtrl.LoadPublicMessage
};

