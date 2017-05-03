/**
 * Created by Ling on 2017/3/18.
 */
"use strict";
var DBConfig = require("./DBConfig");
let dbconfig = new DBConfig();
var success_statuscode = 200;
var url = dbconfig.getURL();
var PrivateChatDBOper = require("../models/PrivateChatDBOper.js");

class PrivateChatCtrl{
    /* Insert a private message into database
     */
    AddPrivateMessage (req, res) {
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
    LoadPrivateHistoryMessage (req, res) {
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
    getCount_IndividualPrivateSender (req,res){
        var username = req.params.receiver;
        let dboper = new PrivateChatDBOper("", username, url);
        //emit count of all unread msg(public + private)
        dboper.GetCount_IndividualPrivateSender(function(statuscode, results){
            if(statuscode==success_statuscode) {
                res.json({success:1, data: results});
            }
            else {
                res.json({success:0, err_type: 1, err_msg:"Database Error"});
            }
        });
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



    /*
     * User search for serval keywords
     */
    search (req, res) {
        var user = req.params.user;
        var keywords = req.body;
        let dboper = new PrivateChatDBOper("", user, url);

        dboper.SearchMessages(user, keywords, function(statuscode, results) {
            if(statuscode==success_statuscode) {
                res.json({success:1, data: results});

            }
            else{
                res.json({success:0, err_type: 1, err_msg:"Database Error"});
            }
        });
    }

}

let privatetrl = new PrivateChatCtrl();
module.exports={
    AddPrivateMessage: privatetrl.AddPrivateMessage,
    LoadPrivateHistoryMessage: privatetrl.LoadPrivateHistoryMessage,
    //getCount_AllUnreadMsg: privatetrl.getCount_AllUnreadMsg,
    //getCount_AllPrivateUnreadMsg: privatetrl.getCount_AllPrivateUnreadMsg,
    getCount_IndividualPrivateSender: privatetrl.getCount_IndividualPrivateSender,
    //get_IndividualPrivateUnreadMsg: privatetrl.get_IndividualPrivateUnreadMsg,
    search: privatetrl.search
};
