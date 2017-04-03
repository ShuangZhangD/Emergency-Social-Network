/**
 * Created by Ling on 2017/3/18.
 */
"use strict";
var PrivateChatDBOper = require("../models/PrivateChatDBOper.js");

var success_statuscode = 200;

class PrivateChatCtrl {
    /* Insert a private message into database
     */
    AddPrivateMessage (req, res) {
        var info = req.body;
        var sender = info["sender"];
        var receiver = info["receiver"];

        let dboper = new PrivateChatDBOper(sender, receiver);
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
    LoadPrivateHistoryMessage (req, res) {
        var sender = req.param("sender");
        var receiver = req.param("receiver");

        let dboper = new PrivateChatDBOper(sender, receiver);
        dboper.LoadHistoryMsg(function(statuscode, content){
            if(statuscode == success_statuscode){
                res.json({success:1, data: content});
            }else{
                res.json({success:0, err_type: 1, err_msg:"Database Error"});
            }
        });
    }

    /* socket function when private message is sent from A->B:
     * msg emit to A and B
     * emit update notification of unread message count of total unread msg, total unread private msg, individual unread msg
     * @param socket: the socket of sender
     * @param ConnectedSockets: all connected sockets
     */
    privateMessageSocket (socket, ConnectedSockets){
        return function(msg) {
            var sender = msg.sender;
            var receiver = msg.receiver;
            var status = msg.emergency_status;

            // emit msg
            // msg should be in form of {"sender": , "receiver": , "private_msg": }
            msg["timestamp"] = Date.now();
            msg["EmergencyStatus"] = status;


            if (ConnectedSockets.hasOwnProperty(receiver)) {
                ConnectedSockets[receiver].emit("PrivateChat", msg);
                //emit update notification of unread
                //emit count of all unread msg(public + private)
                let dboper = new PrivateChatDBOper(sender, receiver);
                dboper.GetCount_AllUnreadMsg(function (statuscode, count) {
                    if (statuscode == success_statuscode) {
                        ConnectedSockets[receiver].emit("AllUnreadMsgCnt", count);
                    }
                });
                //emit count of all unread msg(private)
                dboper.GetCount_AllPrivateUnreadMsg(function (statuscode, count) {
                    if (statuscode == success_statuscode) {
                        ConnectedSockets[receiver].emit("AllPrivateUnreadMsgCnt", count);
                    }
                });

                //emit individual count of unread msg(private)
                dboper.GetCount_IndividualUnreadMsg(function (statuscode, results) {
                    if (statuscode == success_statuscode) {
                        ConnectedSockets[receiver].emit("IndividualPrivateUnreadMsgCnt", results);
                    }
                });
            }
        };
    }

    /* Called when total number of unread message of this username is needed
     */
    getCount_AllUnreadMsg (socket){
        return function(username){
            let dboper = new PrivateChatDBOper("", username);
            //emit count of all unread msg(public + private)
            dboper.GetCount_AllUnreadMsg(function(statuscode, count){
                if(statuscode==success_statuscode) socket.emit("AllUnreadMsgCnt", count);
            });
        };
    }

    /* Called when total number of private unread message of this username is needed
     */
    getCount_AllPrivateUnreadMsg (socket){
        return function(username){
            let dboper = new PrivateChatDBOper("", username);
            //emit count of all unread msg(public + private)
            dboper.GetCount_AllPrivateUnreadMsg(function(statuscode, count){
                if(statuscode==success_statuscode) socket.emit("AllPrivateUnreadMsgCnt", count);
            });
        };
    }

    /* Called when indivudual number of private unread message of this username is needed
     */
    getCount_IndividualPrivateUnreadMsg (socket){
        return function(username){
            let dboper = new PrivateChatDBOper("", username);
            //emit count of all unread msg(public + private)
            dboper.GetCount_IndividualUnreadMsg(function(statuscode, results){
                if(statuscode==success_statuscode) socket.emit("IndividualPrivateUnreadMsgCnt", results);
            });
        };
    }

    /* Called when indivudual number of private unread message of this username is needed
     */
    getCount_IndividualPrivateSender (req,res) {
        var username = req.param("receiver");
        let dboper = new PrivateChatDBOper("", username);
        //emit count of all unread msg(public + private)
        dboper.GetCount_IndividualPrivateSender(function(statuscode, results){
            if(statuscode==success_statuscode) {
                res.json({success:1, data: results});
            }
            else {
                console.log("error in getCount_IndividualPrivateSender");
                res.json({success:0, err_type: 1, err_msg:"Database Error"});
            }
        });
    }

    /* Called when indivudual sender of latest private unread message of this username is needed
     */
    get_IndividualPrivateUnreadMsg (socket){
        return function(username){
            let dboper = new PrivateChatDBOper("", username);
            //emit count of all unread msg(public + private)
            dboper.Get_LatestIndividualUnreadMsg(function(statuscode, results){
                if(statuscode==success_statuscode) socket.emit("IndividualPrivateUnreadMsg", results);
            });
        };
    }

    /* Maybe DONT NEED!!
     * Called when a user login
     * Tell frontend the unread message number of this user
     * Use socket.io
     */
    UnreadCount (socket, username){
        let dboper = new PrivateChatDBOper("", username);
        //emit count of all unread msg(public + private)
        dboper.GetCount_AllUnreadMsg(function(statuscode, count){
            if(statuscode==success_statuscode) socket.emit("AllUnreadMsgCnt", count);
        });

        //emit count of all unread msg(private)
        dboper.GetCount_AllPrivateUnreadMsg(function(statuscode, count){
            if(statuscode==success_statuscode) socket.emit("AllPrivateUnreadMsgCnt", count);
        });

        //emit individual count of unread msg(private)
        dboper.GetCount_IndividualUnreadMsg(function(statuscode, results){
            if(statuscode==success_statuscode) socket.emit("IndividualPrivateUnreadMsgCnt", results);
        });
    }

    /*
      For testing, ignore it
     */
    privateMessageTest (req,res){
        // emit msg
        // msg should be in form of {"sender": , "receiver": , "private_msg": }
        var receiver = req.param("receiver");
        let dboper = new PrivateChatDBOper("", receiver);
        console.log(res);
        //emit individual count of unread msg(private)
        dboper.Get_LatestIndividualUnreadMsg(function (statuscode, results) {
            if (statuscode == success_statuscode) {
                console.log("RESULT:");
                console.dir(results);
            }
        });

        dboper.GetUserEmergencyStatus(receiver, function(statuscode, status){
            console.log("HAHASTATUS:" + status);
        });
    }

    /* Called in socket.io when private msg between sender and receiver are read
     * It is supposed to be called when receiver is in private chat page with sender, which means all the message sent
     * should be marked read. Frontend should emit PrivateMsgRead event every time msg sent in this situation.
     * This function can update all msg between sender and receiver to be read
     */
    MarkedAsRead (){
        return function(userinfo){
            var sender = userinfo.sender;
            var receiver = userinfo.receiver;

            let dboper = new PrivateChatDBOper(sender, receiver);
            dboper.UpdateReadStatus(function(statuscode, content){console.log(content);});
        };
    }

    /*
     * User search for serval keywords
     */
    search (req, res) {
        var user = req.param("user");
        var keywords = req.body;
        let dboper = new PrivateChatDBOper("", user);
        //var message = info["PrivateMsg"];
        //console.log(user);
        //console.log(info);
        dboper.SearchMessages(user, keywords, function(statuscode, results) {
            if(statuscode==success_statuscode) {
                res.json({success:1, data: results});

            }
            else{
                console.log("error in search in privatechat");
                res.json({success:0, err_type: 1, err_msg:"Database Error"});
            }
        });
    }

}

let pcc = new PrivateChatCtrl();

module.exports = {
    AddPrivateMessage : pcc.AddPrivateMessage,
    LoadPrivateHistoryMessage : pcc.LoadPrivateHistoryMessage,
    privateMessageSocket : pcc.privateMessageSocket,
    getCount_AllUnreadMsg : pcc.getCount_AllUnreadMsg,
    getCount_AllPrivateUnreadMsg : pcc.getCount_AllPrivateUnreadMsg,
    getCount_IndividualPrivateUnreadMsg : pcc.getCount_IndividualPrivateUnreadMsg,
    getCount_IndividualPrivateSender : pcc.getCount_IndividualPrivateSender,
    get_IndividualPrivateUnreadMsg : pcc.get_IndividualPrivateUnreadMsg,
    UnreadCount : pcc.UnreadCount,
    privateMessageTest : pcc.privateMessageTest,
    MarkedAsRead : pcc.MarkedAsRead,
    search : pcc.search
};
