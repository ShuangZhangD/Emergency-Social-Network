/**
 * Created by Ling on 2017/4/5.
 */
/**
 * Created by Ling on 2017/3/18.
 */
"use strict";
var DBConfig = require("./DBConfig");
let dbconfig = new DBConfig();
var url = dbconfig.getURL();
var PrivateChatDBOper = require("../models/PrivateChatDBOper.js");

var success_statuscode = 200;
class PrivateChatSocketCtrl{

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
            msg["timestamp"] = Date.now();
            msg["EmergencyStatus"] = status;
            //socket.emit("PrivateChat", msg);
            if (ConnectedSockets.hasOwnProperty(receiver)) {
                ConnectedSockets[receiver].emit("PrivateChat", msg);
                //emit update notification of unread
                //emit count of all unread msg(public + private)
                let dboper = new PrivateChatDBOper(sender, receiver, url);
                /*dboper.GetCount_AllUnreadMsg(function (statuscode, count) {
                 if (statuscode == success_statuscode) ConnectedSockets[receiver].emit("AllUnreadMsgCnt", count);
                 });
                 //emit count of all unread msg(private)
                 dboper.GetCount_AllPrivateUnreadMsg(function (statuscode, count) {
                 if (statuscode == success_statuscode) ConnectedSockets[receiver].emit("AllPrivateUnreadMsgCnt", count);
                 });*/
                //emit individual count of unread msg(private)
                dboper.GetCount_IndividualUnreadMsg(function (statuscode, results) {
                    if (statuscode == success_statuscode) ConnectedSockets[receiver].emit("IndividualPrivateUnreadMsgCnt", results);
                });
            }
        };
    }

    /* Called when total number of unread message of this username is needed
     */
    /*getCount_AllUnreadMsg (socket){
     return function(username){
     let dboper = new PrivateChatDBOper("", username, url);
     //emit count of all unread msg(public + private)
     dboper.GetCount_AllUnreadMsg(function(statuscode, count){
     if(statuscode==success_statuscode) socket.emit("AllUnreadMsgCnt", count);
     });
     };
     }*/

    /* Called when total number of private unread message of this username is needed
     */
    // getCount_AllPrivateUnreadMsg (socket){
    //     return function(username){
    //         let dboper = new PrivateChatDBOper("", username, url);
    //         //emit count of all unread msg(public + private)
    //         dboper.GetCount_AllPrivateUnreadMsg(function(statuscode, count){
    //             if(statuscode==success_statuscode) socket.emit("AllPrivateUnreadMsgCnt", count);
    //         });
    //     };
    // }

    /* Called when indivudual number of private unread message of this username is needed
     */
    getCount_IndividualPrivateUnreadMsg (socket){
        return function(username){
            let dboper = new PrivateChatDBOper("", username, url);
            //emit count of all unread msg(public + private)
            dboper.GetCount_IndividualUnreadMsg(function(statuscode, results){
                if(statuscode==success_statuscode) socket.emit("IndividualPrivateUnreadMsgCnt", results);
            });
        };
    }

    /* Called when indivudual sender of latest private unread message of this username is needed
     */
    // get_IndividualPrivateUnreadMsg (socket){
    //     return function(username){
    //         let dboper = new PrivateChatDBOper("", username, url);
    //         //emit count of all unread msg(public + private)
    //         dboper.Get_LatestIndividualUnreadMsg(function(statuscode, results){
    //             if(statuscode==success_statuscode) socket.emit("IndividualPrivateUnreadMsg", results);
    //         });
    //     };
    // }

    /* Maybe DONT NEED!!
     * Called when a user login
     * Tell frontend the unread message number of this user
     * Use socket.io
     */
    UnreadCount (socket, username){
        let dboper = new PrivateChatDBOper("", username, url);
        //emit count of all unread msg(public + private)
        // dboper.GetCount_AllUnreadMsg(function(statuscode, count){
        //     if(statuscode==success_statuscode) socket.emit("AllUnreadMsgCnt", count);
        // });
        //
        // //emit count of all unread msg(private)
        // dboper.GetCount_AllPrivateUnreadMsg(function(statuscode, count){
        //     if(statuscode==success_statuscode) socket.emit("AllPrivateUnreadMsgCnt", count);
        // });

        //emit individual count of unread msg(private)
        dboper.GetCount_IndividualUnreadMsg(function(statuscode, results){
            if(statuscode==success_statuscode) socket.emit("IndividualPrivateUnreadMsgCnt", results);
        });
    }

    /*
     For testing, ignore it
     */
    /*privateMessageTest (req,res){
     // emit msg
     // msg should be in form of {"sender": , "receiver": , "private_msg": }
     var receiver = req.param("receiver");
     let dboper = new PrivateChatDBOper("", receiver, url);
     console.log(res);
     //emit individual count of unread msg(private)
     dboper.Get_LatestIndividualUnreadMsg(function (statuscode, results) {
     if (statuscode == success_statuscode) {
     console.dir(results);
     }
     });

     dboper.GetUserEmergencyStatus(receiver, function(statuscode, status){
     console.log("STATUS:" + status);
     });
     }*/

    /* Called in socket.io when private msg between sender and receiver are read
     * It is supposed to be called when receiver is in private chat page with sender, which means all the message sent
     * should be marked read. Frontend should emit PrivateMsgRead event every time msg sent in this situation.
     * This function can update all msg between sender and receiver to be read
     */
    MarkedAsRead (){
        return function(userinfo){
            var sender = userinfo.sender;
            var receiver = userinfo.receiver;
            let dboper = new PrivateChatDBOper(sender, receiver, url);
            dboper.UpdateReadStatus(function(statuscode, content){console.log(content);});
        };
    }

    ReceiverUsernameChange(socket){
        return function(param){
            socket.broadcast.emit("receiver username changed", param);
        };
    }

    ReceiverAccountstatusChange(socket){
        return function(param){
            socket.broadcast.emit("receiver Accountstatus changed", param);
        };
    }
}

let privatetrl = new PrivateChatSocketCtrl();
module.exports={
   // AddPrivateMessage: privatetrl.AddPrivateMessage,
   // LoadPrivateHistoryMessage: privatetrl.LoadPrivateHistoryMessage,
    privateMessageSocket: privatetrl.privateMessageSocket,
    //getCount_AllUnreadMsg: privatetrl.getCount_AllUnreadMsg,
    //getCount_AllPrivateUnreadMsg: privatetrl.getCount_AllPrivateUnreadMsg,
    getCount_IndividualPrivateUnreadMsg: privatetrl.getCount_IndividualPrivateUnreadMsg,
    //getCount_IndividualPrivateSender: privatetrl.getCount_IndividualPrivateSender,
    //get_IndividualPrivateUnreadMsg: privatetrl.get_IndividualPrivateUnreadMsg,
    UnreadCount: privatetrl.UnreadCount,
    MarkedAsRead: privatetrl.MarkedAsRead,
    search: privatetrl.search,
    ReceiverUsernameChange: privatetrl.ReceiverUsernameChange,
    ReceiverAccountstatusChange:privatetrl.ReceiverAccountstatusChange
};


