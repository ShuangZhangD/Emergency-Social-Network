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
            res.json({data: content});
        });
    }

    getMyGroupList (req, res) {
        var username = req.params.username;
        let dboper = new GroupChatDBOper("",username, url);
        dboper.getMyGroupList(function(statuscode, content){
            res.json({data: content});
        });
    }

    joinGroup (req, res) {
        var info = req.body;
        var group = info["group"];
        var username = info["username"];

        let dboper = new GroupChatDBOper(group, username, url);
        dboper.joinGroup(function(statuscode, content){
            if(statuscode == success_statuscode){
                res.json({success:1, suc_msg: "Success"});
            }
            else{
                res.json({success:0, err_type: 1, err_msg:content});
            }
        });
    }

    leaveGroup (req, res) {
        var info = req.body;
        var group = info["group"];
        var username = info["username"];

        let dboper = new GroupChatDBOper(group, username, url);
        dboper.leaveGroup(function(statuscode, content){
            if(statuscode == success_statuscode){
                res.json({success:1, suc_msg: "Success"});
            }
            else{
                res.json({success:0, err_type: 1, err_msg:content});
            }
        });
    }

    createGroup (req, res) {
        var info = req.body;
        var group = info["group"];
        var username = info["username"];

        let dboper = new GroupChatDBOper(group, username, url);
        dboper.createGroup(function(statuscode, content){
            if(statuscode == success_statuscode){
                res.json({success:1, suc_msg: "Success"});
            }
            else{
                res.json({success:0, err_type: 1, err_msg:content});
            }
        });
    }

    AddGroupMessage (req, res) {
        var info = req.body;
        var sender = info["sender"];
        var receiver = info["receiver"];

        let dboper = new PrivateChatDBOper(sender, receiver, url);
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
        var sender = req.params.sender;
        var receiver = req.params.receiver;

        let dboper = new PrivateChatDBOper(sender, receiver, url);
        dboper.LoadHistoryMsg(function(statuscode, content){
            if(statuscode == success_statuscode){
                res.json({success:1, data: content});
            }else{
                res.json({success:0, err_type: 1, err_msg:"Database Error"});
            }
        });
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
    LoadGroupHistoryMessage: groupChatCtrl.LoadGroupHistoryMessage
};
