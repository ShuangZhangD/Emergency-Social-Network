/**
 * Created by shuang on 3/18/17.
 */

var express = require('express');
var myParser = require("body-parser");
var dboper = require("../models/PublicChatDBoper.js");
var app = express();

module.exports = {


    AddAnnouncement : function (req, res) {
        var info = req.body;
        var announcement = info["announcement"];
        var sender = info["username"];
        dboper.InsertAnnouncement(sender, announcement, Date.now(), function (err, results) {
            if (err) {
                console.log('Error:'+ err);
                res.json({success:0, err_type: 1, err_msg:"Database Error"});
            } else {
                res.json({success:1, suc_msg: "Success"});

            }});
    },

    AnnouncementSocket : function (socket) {
        return function(data) {
            socket.emit('Post Announcement', data);
            socket.broadcast.emit('Post Announcement', data);
        };
    },
    LoadAnnouncement : function(req, res){
        dboper.LoadAnnouncement(function (err, results) {
            if (err) {
                console.log('Error:'+ err);
                res.json({success:0, err_type: 1, err_msg:results});
            } else {

                res.json({success:1, data: results});
            }
        });
    }

};