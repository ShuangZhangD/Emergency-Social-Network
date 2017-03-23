/**
 * Created by Ling on 2017/3/18.
 */
'use strict';
var express = require('express');
var myParser = require("body-parser");
var PrivateChatDBOper = require("../models/PrivateChatDBOper.js");
var app = express();

var success_statuscode = 200;
module.exports = {
    /* Insert a private message into database
     */
    AddPrivateMessage : function (req, res) {
        var info = req.body;
        var message = info["PrivateMsg"];
        var sender = info["sender"];
        var receiver = info["receiver"];
        console.log("=========INFO--------: ")
        console.dir(info);

        let dboper = new PrivateChatDBOper(sender, receiver);
        dboper.InsertMessage(info, function(statuscode, content){
            if(statuscode == success_statuscode){
                res.json({success:1, suc_msg: "Success"});
            }
            else{
                res.json({success:0, err_type: 1, err_msg:"Database Error"});
            }
        })
    },

    /* Load all the history private msg
     * also update all unread msg between sender and receiver to be read
     */
    LoadPrivateHistoryMessage : function(req, res) {
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
    },

    /* socket function when private message is sent from A->B:
     * msg emit to A and B
     * emit update notification of unread message count of total unread msg, total unread private msg, individual unread msg
     * @param socket: the socket of sender
     * @param ConnectedSockets: all connected sockets
     */
    privateMessageSocket : function(socket, ConnectedSockets){
        return function(msg) {
            var sender = msg.sender;
            var receiver = msg.receiver;
            var status = msg.emergency_status;
            console.log("SENDER IS "+sender)
                    console.log("RECEIVER IS"+receiver)
                    console.log("MESSAGE IS" +msg)
            // emit msg
            // msg should be in form of {"sender": , "receiver": , "private_msg": }
            msg["timestamp"] = Date.now();
            //let dboper = new PrivateChatDBOper(sender, receiver);
            //dboper.GetUserEmergencyStatus(sender, function(statuscode, status) {
                //if (statuscode == success_statuscode){
                    msg["EmergencyStatus"] = status;

                    //socket.emit('PrivateChat', msg);
                    console.log("PRIVATE CHAT NEED TO SEND TO 0001")
                    //console.log(ConnectedSockets)
                    console.log("IF FOUND: "+ConnectedSockets.hasOwnProperty(receiver))

                    console.log("SOCKET OF 0002"+ConnectedSockets["0002"])
                if (ConnectedSockets.hasOwnProperty(receiver)) {
                    console.log("PRIVATE CHAT NEED TO SEND TO 0002")
                    ConnectedSockets[receiver].emit('PrivateChat', msg);

                    //emit update notification of unread

                    //emit count of all unread msg(public + private)
                    let dboper = new PrivateChatDBOper(sender, receiver);
                    dboper.GetCount_AllUnreadMsg(function (statuscode, count) {
                        if (statuscode == success_statuscode) ConnectedSockets[receiver].emit('AllUnreadMsgCnt', count)
                    });

                    //emit count of all unread msg(private)
                    dboper.GetCount_AllPrivateUnreadMsg(function (statuscode, count) {
                        if (statuscode == success_statuscode) ConnectedSockets[receiver].emit('AllPrivateUnreadMsgCnt', count)
                    });

                    //emit individual count of unread msg(private)
                    dboper.GetCount_IndividualUnreadMsg(function (statuscode, results) {
                        if (statuscode == success_statuscode) ConnectedSockets[receiver].emit('IndividualPrivateUnreadMsgCnt', results)
                    });

                    //emit individual latest unread msg(private)
                    /*dboper.Get_LatestIndividualUnreadMsg(function(statuscode, results){
                        if(statuscode==success_statuscode) ConnectedSockets[receiver].emit('IndividualPrivateUnreadMsg', results)
                    });*/
                }
            //}
       // });
        };
    },

    /* Called when total number of unread message of this username is needed
     */
    getCount_AllUnreadMsg : function(socket){
        return function(username){
            let dboper = new PrivateChatDBOper("", username);
            //emit count of all unread msg(public + private)
            dboper.GetCount_AllUnreadMsg(function(statuscode, count){
                if(statuscode==success_statuscode) socket.emit('AllUnreadMsgCnt', count)
            });
        }
    },

    /* Called when total number of private unread message of this username is needed
     */
    getCount_AllPrivateUnreadMsg : function(socket){
        return function(username){
            let dboper = new PrivateChatDBOper("", username);
            //emit count of all unread msg(public + private)
            dboper.GetCount_AllPrivateUnreadMsg(function(statuscode, count){
                if(statuscode==success_statuscode) socket.emit('AllPrivateUnreadMsgCnt', count)
            });
        }
    },

    /* Called when indivudual number of private unread message of this username is needed
     */
    getCount_IndividualPrivateUnreadMsg : function(socket){
        return function(username){
            let dboper = new PrivateChatDBOper("", username);
            //emit count of all unread msg(public + private)
            dboper.GetCount_IndividualUnreadMsg(function(statuscode, results){
                if(statuscode==success_statuscode) socket.emit('IndividualPrivateUnreadMsgCnt', results)
            });
        }
    },

    /* Called when indivudual number of private unread message of this username is needed
     */
    getCount_IndividualPrivateSender : function(req,res){
            console.log('==== getCount_IndividualPrivateSender called! ======');
			var username = req.param("receiver");
             console.log(username);
			let dboper = new PrivateChatDBOper("", username);
            //emit count of all unread msg(public + private)
            dboper.GetCount_IndividualPrivateSender(function(statuscode, results){
                if(statuscode==success_statuscode) {
					res.json({success:1, data: results});
					console.log('succ');
					console.log(results);
				}
                else{
					console.log('err');
                    res.json({success:0, err_type: 1, err_msg:"Database Error"});
                }
            });

    },

    /* Called when indivudual sender of latest private unread message of this username is needed
     */
    get_IndividualPrivateUnreadMsg : function(socket){
        return function(username){
            let dboper = new PrivateChatDBOper("", username);
            //emit count of all unread msg(public + private)
            dboper.Get_LatestIndividualUnreadMsg(function(statuscode, results){
                if(statuscode==success_statuscode) socket.emit('IndividualPrivateUnreadMsg', results)
            });
        }
    },

    /* Maybe DONT NEED!!
     * Called when a user login
     * Tell frontend the unread message number of this user
     * Use socket.io
     */
    UnreadCount : function(socket, username){
        let dboper = new PrivateChatDBOper("", username);
        //emit count of all unread msg(public + private)
        dboper.GetCount_AllUnreadMsg(function(statuscode, count){
            if(statuscode==success_statuscode) socket.emit('AllUnreadMsgCnt', count)
        });

        //emit count of all unread msg(private)
        dboper.GetCount_AllPrivateUnreadMsg(function(statuscode, count){
            if(statuscode==success_statuscode) socket.emit('AllPrivateUnreadMsgCnt', count)
        });

        //emit individual count of unread msg(private)
        dboper.GetCount_IndividualUnreadMsg(function(statuscode, results){
            if(statuscode==success_statuscode) socket.emit('IndividualPrivateUnreadMsgCnt', results)
        });
    },

    /*
      For testing, ignore it
     */
    privateMessageTest : function(req,res){
        // emit msg
        // msg should be in form of {"sender": , "receiver": , "private_msg": }
        var receiver = req.param("receiver");
        let dboper = new PrivateChatDBOper("", receiver);

        //emit individual count of unread msg(private)
        dboper.Get_LatestIndividualUnreadMsg(function (statuscode, results) {
            if (statuscode == success_statuscode) {
                console.log("RESULT:");
                console.dir(results)
                console.dir(results["msg"])
            }
        });

        dboper.GetUserEmergencyStatus(receiver, function(statuscode, status){
            console.log("HAHASTATUS:" + status)
        })
    },

    /* Called in socket.io when private msg between sender and receiver are read
     * It is supposed to be called when receiver is in private chat page with sender, which means all the message sent
     * should be marked read. Frontend should emit PrivateMsgRead event every time msg sent in this situation.
     * This function can update all msg between sender and receiver to be read
     */
    MarkedAsRead : function(){
        return function(userinfo){
            console.dir("++++")
            var sender = userinfo.sender;
            var receiver = userinfo.receiver;
            console.dir(userinfo)
            console.log("=====IN MARKASREAD====")
            let dboper = new PrivateChatDBOper(sender, receiver);
            dboper.UpdateReadStatus(function(statuscode, content){})
        }
    }

};
