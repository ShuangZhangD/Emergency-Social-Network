/**
 * Created by shuang on 3/18/17.
 */
"use strict";

var dboper = require("../models/PostAnnouncementDBoper.js");

class PostAnnouncementCtrl {

    AddAnnouncement (req, res) {
        var info = req.body;
        var announcement = info["announcement"];
        var username = info["username"];
        dboper.InsertAnnouncement(username, announcement, Date.now(), function (err, results) {
            if (err) {
                console.log("Error:"+ err);
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

    LoadAnnouncement (req, res){
        dboper.LoadAnnouncement(function (err, results) {
            if (err) {
                console.log("Error:"+ err);
                res.json({success:0, err_type: 1, err_msg:results});
            }
            else {
                res.json({success:1, data: results});
            }
        });
    }
}

let pac = new PostAnnouncementCtrl();

module.exports = {
    AddAnnouncement: pac.AddAnnouncement,
    AnnouncementSocket: pac.AnnouncementSocket,
    LoadAnnouncement: pac.LoadAnnouncement
};
