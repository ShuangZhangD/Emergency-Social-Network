/**
 * Created by shuang on 3/18/17.
 */
"use strict";

var dboper = require("../models/PostAnnouncementDBoper.js");
var DBConfig = require("./DBConfig");
let dbconfig = new DBConfig();
var url = dbconfig.getURL();
var success_statuscode = 200;

class PostAnnouncementCtrl {

    AddAnnouncement (req, res) {
        var info = req.body;
        var announcement = info["announcement"];
        var username = info["username"];
        var accountstatus = info["accountstatus"];
        dboper.InsertAnnouncement(username, announcement, Date.now(), accountstatus,url, function (err, results) {
            if (err) {
                res.json({success:0, err_type: 1, err_msg:results});
            } else {
                res.json({success:1, suc_msg: "Success"});
            }});
    }

    AnnouncementSocket (socket) {
        return function(data) {
            socket.emit("Post Announcement", data);
            socket.broadcast.emit("Post Announcement", data);
        };
    }

    changeUsernameSocket (socket) {
        return function(params) {
            socket.broadcast.emit("Username Changed In Announcement", params);
        };
    }

    changeAccountStatusSocket (socket) {
        return function(params) {
            socket.broadcast.emit("AccountStatus Changed In Announcement", params);
        };
    }

    LoadAnnouncement (req, res){
        dboper.LoadAnnouncement(url, function (err, results) {
            if (err) {
                res.json({success:0, err_type: 1, err_msg:results});
            }
            else {
                res.json({success:1, data: results});
            }
        });
    }

    searchPublicAnn (req, res) {
        var keywords = req.body;

        dboper.SearchPublicAnn(keywords, url, function(statuscode, results) {
            if(statuscode==success_statuscode) {
                res.json({success:1, data: results});
            }
            else{
                res.json({success:0, err_type: 1, err_msg:"Database Error"});
            }
        });
    }
}

let pac = new PostAnnouncementCtrl();

module.exports = {
    AddAnnouncement: pac.AddAnnouncement,
    AnnouncementSocket: pac.AnnouncementSocket,
    LoadAnnouncement: pac.LoadAnnouncement,
    searchPublicAnn: pac.searchPublicAnn,
    changeUsernameSocket: pac.changeUsernameSocket,
    changeAccountStatusSocket: pac.changeAccountStatusSocket
};
