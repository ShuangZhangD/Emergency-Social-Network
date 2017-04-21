/**
 * Created by Ling on 2017/3/18.
 */
"use strict";
var DBConfig = require("./DBConfig");
let dbconfig = new DBConfig();
var url = dbconfig.getURL();
var GroupChatDBOper = require("../models/GroupChatDBOper.js");

var success_statuscode = 200;
class GroupChatCtrl{
    /* Insert a private message into database
     */
    getAllGroupList (req, res) {
        let dboper = new GroupChatDBOper("","", url);
        dboper.getAllGroupList(function(statuscode, content){
            console.log("get all groups"+content);
            res.json({success:1,data: content});
        });
    }

    getMyGroupList (req, res) {
        var username = req.params.username;
        let dboper = new GroupChatDBOper("",username, url);
        dboper.getMyGroupList(function(statuscode, content){
            res.json({success:1,data: content});
        });
    }

    joinGroup (req, res) {
        var info = req.body;
        var group = info["group"];
        var username = info["username"];

        let dboper = new GroupChatDBOper(group, username, url);
        dboper.joinGroup(function(err, content){
            if(err){
                res.json({success:0, err_type: 1, err_msg:content});
            }
            else{
                res.json({success:1, suc_msg: "Success"});
            }
        });
    }

    leaveGroup (req, res) {
        var info = req.body;
        var group = info["group"];
        var username = info["username"];

        let dboper = new GroupChatDBOper(group, username, url);
        dboper.leaveGroup(function(err, content){
            // if(err){
            //     res.json({success:0, err_type: 1, err_msg:content});
            // }
            // else{
                res.json({success:1, suc_msg: "Success"});
            // }
        });
    }

    createGroup (req, res) {
        var info = req.body;
        var group = info["group"];
        var username = info["username"];

        let dboper = new GroupChatDBOper(group, username, url);
        dboper.createGroup(function(err, content){
            if(err){
                res.json({success:0, err_type: 1, err_msg:content});
            }
            else{
                res.json({success:1, suc_msg: "Success"});
            }
        });
    }

    AddGroupMessage (req, res) {
        var info = req.body;
        var sender = info["sender"];
        var receiver = info["receiver"];

        let dboper = new GroupChatDBOper(sender, receiver, url);
        dboper.InsertMessage(info, function(statuscode, content){
            if(statuscode == success_statuscode){
                res.json({success:1, suc_msg: "Success"});
            }
            else{
                res.json({success:0, err_type: 1, err_msg:content});
            }
        });
    }

    /* Load all the history private msg
     * also update all unread msg between sender and receiver to be read
     */
    LoadGroupHistoryMessage (req, res) {
        var info = req.body;
        var group = req.params.group;

        let dboper = new GroupChatDBOper(group, "", url);
        dboper.LoadHistoryMsg(info,function(statuscode, content){
            if(statuscode == success_statuscode){
                res.json({success:1, data: content});
            }else{
                res.json({success:0, err_type: 1, err_msg:"Database Error"});
            }
        });
    }

    groupMessageSocket (socket, ConnectedSockets){
        return function(msg) {
            socket.broadcast.emit("GroupChat", msg);
        };
    }



    createGroupSocket (socket, ConnectedSockets){
        return function(data) {
            socket.broadcast.emit("Create Group", data);
        };
    }
}

let groupChatCtrl = new GroupChatCtrl();
module.exports={
    getAllGroupList: groupChatCtrl.getAllGroupList,
    getMyGroupList: groupChatCtrl.getMyGroupList,
    joinGroup: groupChatCtrl.joinGroup,
    leaveGroup: groupChatCtrl.leaveGroup,
    createGroup: groupChatCtrl.createGroup,
    AddGroupMessage: groupChatCtrl.AddGroupMessage,
    LoadGroupHistoryMessage: groupChatCtrl.LoadGroupHistoryMessage,
    groupMessageSocket:groupChatCtrl.groupMessageSocket,
    createGroupSocket:groupChatCtrl.createGroupSocket
};
