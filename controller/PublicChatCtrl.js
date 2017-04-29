/**
 * Created by shuang on 2/26/17.
 */
"use strict";

var dboper = require("../models/PublicChatDBoper.js");
var DBConfig = require("./DBConfig");
let dbconfig = new DBConfig();
var url = dbconfig.getURL();
//var db_err_msg = "Database Error";
//var db_err_statuscode = 400;
var success_statuscode = 200;

class PublicChatCtrl{

    AddPublicMessage (req, res) {
        var info = req.body;
        var message = info["pubmsg"];
        var sender = info["username"];
        var emergencystatus = info["emergencystatus"];
        var accountstatus = info["accountstatus"];
        dboper.InsertMessage(sender, "", message, "public", Date.now(),emergencystatus, accountstatus,url, function (err, results) {
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

    changeUsernameSocket (socket) {
        return function(params) {
            //socket.emit("Public Message", data);
            socket.broadcast.emit("Username Changed In Public Chat", params);
        };
    }

    changeAccountStatusSocket (socket) {
        return function(params) {
            socket.broadcast.emit("AccountStatus Changed In Public Chat", params);
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

    searchPublicMessages (req, res) {
        var keywords = req.body;
        //let dboper = new PublicChatDBoper("", url);

        dboper.SearchPublicMessages(keywords, url, function(statuscode, results) {
            if(statuscode==success_statuscode) {
                res.json({success:1, data: results});
            }
            else{
                // console.log("err");
                res.json({success:0, err_type: 1, err_msg:"Database Error"});
            }
        });
    }

}

let pubtrl = new PublicChatCtrl();
module.exports={
    AddPublicMessage: pubtrl.AddPublicMessage,
    publicMessageSocket: pubtrl.publicMessageSocket,
    LoadPublicMessage: pubtrl.LoadPublicMessage,
    searchPublicMessages: pubtrl.searchPublicMessages,
    changeUsernameSocket: pubtrl.changeUsernameSocket,
    changeAccountStatusSocket: pubtrl.changeAccountStatusSocket
};
