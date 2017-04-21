/**
 * Created by shuang on 2/26/17.
 */
'use strict';

var express = require('express');
var myParser = require("body-parser");
var dboper = require("../models/PublicChatDBoper.js");
var app = express();

module.exports = {


    AddPublicMessage : function (req, res) {
        var info = req.body;
        var message = info["pubmsg"];
        var sender = info["username"];
        var emergencystatus = info["emergencystatus"];
        dboper.InsertMessage(sender, "", message, "public", Date.now(),emergencystatus, function (err, results) {
            if (err) {
                console.log('Error:'+ err);
                res.json({success:0, err_type: 1, err_msg:"Database Error"});
            } else {
                res.json({success:1, suc_msg: "Success"});

            }});
    },

    publicMessageSocket : function (socket) {
        return function(data) {
            socket.emit('Public Message', data);
            socket.broadcast.emit('Public Message', data);
        };
    },
    LoadPublicMessage : function(req, res){
        dboper.LoadPublicMessage(function (err, results) {
            if (err) {
                console.log('Error:'+ err);
                res.json({success:0, err_type: 1, err_msg:results});
            } else {

                res.json({success:1, data: results});
            }
        });
    }

};
