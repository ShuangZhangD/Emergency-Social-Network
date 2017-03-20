/**
 * Created by Ling on 2017/3/18.
 */
'use strict';
var MongoClient = require('mongodb').MongoClient;
var User = require('./User.js');
var url = 'mongodb://localhost:27017/test';
//var url = 'mongodb://root:1234@ds135700.mlab.com:35700/esnsv7';
var Message = require('./Message.js');

var db_err_msg = "Database Error";
var db_err_statuscode = 400;
var success_statuscode = 200;

class PrivateChatDBOper {

    constructor(sender, receiver) {
        this.sender = sender;
        this.receiver = receiver;

    }

    GetUserEmergencyStatus(username, callback){
        MongoClient.connect(url, function (err, db) {
            if (err) {
                console.log('Error:' + err);
                callback(db_err_statuscode, db_err_msg)
            }// DB Error. Here error of connecting to db
            else {
                //get sender emergency status
                let user = new User(username, "", "");
                user.getEmergencyStatus(db, function (status, err) {
                    if (err) {
                        console.log('Error:' + err);
                        callback(db_err_statuscode, db_err_msg)
                    }// DB Error
                    else {
                        callback(success_statuscode, status);
                    }
                })
                db.close();
            }
        })
    }

    InsertMessage(message, callback, sender = this.sender, receiver = this.receiver) {
        MongoClient.connect(url, function (err, db) {
            if (err) {
                console.log('Error:' + err);
                callback(db_err_statuscode, db_err_msg)
            }// DB Error. Here error of connecting to db
            else {
                //get sender emergency status
                let user = new User(sender, "", "");
                user.getEmergencyStatus(db, function (status, err) {
                    if (err) {
                        console.log('Error:' + err);
                        callback(db_err_statuscode, db_err_msg)
                    }// DB Error
                    else {
                        let MSG = new Message(sender, receiver, "private", message, Date.now(), status, "unread")
                        MSG.insertMessage(db, function (msgres, err) {
                            if (err) {
                                console.log('Error:' + err);
                                callback(db_err_statuscode, db_err_msg)
                            }// DB Error
                            else {
                                callback(success_statuscode, null)
                            }
                        });
                        db.close()
                    }
                });

            }
        })
    }

    /*
     * Load all private history message
     * Also update all unread private msg to be read
     */
    LoadHistoryMsg(callback, sender = this.sender, receiver = this.receiver) {
        MongoClient.connect(url, function (err, db) {
            if (err) {
                callback(db_err_statuscode, db_err_msg)
            }// DB Error. Here error of connecting to db
            else {
                //set all <sender,receiver> private messages to be read
                let MSG = new Message(sender, receiver, "", "", "", "", "");
                MSG.updateReadStatus(db, function (result, err) {
                    if (err) {
                        console.log('Error:' + err);
                        callback(db_err_statuscode, db_err_msg)
                    }// DB Error
                    else {
                        //load all private messages between sender and receiver
                        MSG.loadPrivateHistoryMsg(db, function (results, err) {
                            if (err) callback(db_err_statuscode, db_err_msg);
                            else callback(success_statuscode, results)
                        });
                        db.close()
                    }
                })
            }
        })
    }

    UpdateReadStatus(callback, sender = this.sender, receiver = this.receiver){
        MongoClient.connect(url, function (err, db) {
            if (err) {
                callback(db_err_statuscode, db_err_msg)
            }// DB Error. Here error of connecting to db
            else {
                let MSG = new Message(sender, receiver, "", "", "", "", "");
                MSG.updateReadStatus(db, function (result, err) {
                    if (err) {
                        console.log('Error:' + err);
                        callback(db_err_statuscode, db_err_msg)
                    }// DB Error
                    else {
                        callback(success_statuscode, result);
                        db.close()
                    }
                })
            }
        })
    }

    /* Get how many unread msg of receiver
     * public + private msg
     */
    GetCount_AllUnreadMsg(callback, receiver = this.receiver) {
        MongoClient.connect(url, function (err, db) {
            if (err) {
                callback(db_err_statuscode, db_err_msg)
            }// DB Error. Here error of connecting to db
            else {
                let MSG = new Message("", receiver, "", "", "", "", "");
                MSG.getCount_AllUnreadMsg(db, function (count, err) {
                    if (err) callback(db_err_statuscode, db_err_msg);
                    else callback(success_statuscode, count)
                });
                db.close()
            }
        })
    }

    /* Get how many unread private msg of receiver
     * only private msg
     */
    GetCount_AllPrivateUnreadMsg(callback, receiver = this.receiver) {
        MongoClient.connect(url, function (err, db) {
            if (err) {
                callback(db_err_statuscode, db_err_msg)
            }// DB Error. Here error of connecting to db
            else {
                let MSG = new Message("", receiver, "", "", "", "", "");
                MSG.getCount_AllPrivateUnreadMsg(db, function (count, err) {
                    if (err) callback(db_err_statuscode, db_err_msg);
                    else callback(success_statuscode, count)
                });
                db.close()
            }
        })
    }

    /* Get individual count of private msg of receiver
     * return type is an object
     */
    GetCount_IndividualUnreadMsg(callback, receiver = this.receiver) {
        MongoClient.connect(url, function (err, db) {
            if (err) {
                callback(db_err_statuscode, db_err_msg)
            }// DB Error. Here error of connecting to db
            else {
                let MSG = new Message("", receiver, "", "", "", "", "");
                MSG.getUnreadMsgSenderList(db, function (senderlist, err) {
                    if (err) callback(db_err_statuscode, db_err_msg);
                    else {
                        var results = [];
                        for(var i = 0 ; i < senderlist.length;i++){
                            (function (i) {
                                var sender = senderlist[i];
                                MSG.getCount_PrivateUnreadMsg(db, sender, receiver, function (count, err) {
                                    if (err) callback(db_err_statuscode, db_err_msg);
                                    else {
                                        var result = {};
                                        result["sender"] = sender;
                                        result["count"] = count;
                                        results.push(result);
                                        if(i == senderlist.length-1){
                                            callback(success_statuscode, results);
                                        }
                                    }
                                });
                            })(i);
                        }
                    }
                    db.close()
                })
            }
        })
    }

    /* Get individual count of private msg of receiver
     * return type is an object
     */
    GetCount_IndividualPrivateSender(callback, receiver = this.receiver) {
        MongoClient.connect(url, function (err, db) {
            if (err) {
                callback(db_err_statuscode, db_err_msg)
            }// DB Error. Here error of connecting to db
            else {
                let MSG = new Message("", receiver, "", "", "", "", "");
                MSG.getPrivateMsgSenderList(db, function (senderlist, err) {
                    if (err) callback(db_err_statuscode, db_err_msg);
                    else {
                        var results = [];
                        for(var i = 0 ; i < senderlist.length;i++){
                            (function (i) {
                                var sender = senderlist[i];
                                MSG.getCount_PrivateUnreadMsg(db, sender, receiver, function (count, err) {
                                    if (err) callback(db_err_statuscode, db_err_msg);
                                    else {
                                        var result = {};
                                        result["sender"] = sender;
                                        result["count"] = count;
                                        results.push(result);
                                        if(i == senderlist.length-1){
                                            callback(success_statuscode, results);
                                        }
                                    }
                                });
                            })(i);
                        }
                    }
                    db.close()
                })
            }
        })
    }

    Get_LatestIndividualUnreadMsg(callback, receiver = this.receiver){
        MongoClient.connect(url, function (err, db) {
            if (err) {
                callback(db_err_statuscode, db_err_msg)
            }// DB Error. Here error of connecting to db
            else {
                let MSG = new Message("", receiver, "", "", "", "", "");
                MSG.getUnreadMsgSenderList(db, function (senderlist, err) {
                    if (err) callback(db_err_statuscode, db_err_msg);
                    else {
                        var results = [];
                        for(var i = 0 ; i < senderlist.length;i++){
                            (function (i) {
                                var sender = senderlist[i];
                                MSG.get_LatestPrivateUnreadMsg(db, sender, receiver, function (msg, err) {
                                    if (err) callback(db_err_statuscode, db_err_msg);
                                    else {
                                        console.log("LATEST MSG:");
                                        console.dir(msg);
                                        var result = {};
                                        result["sender"] = sender;
                                        result["msg"] = msg;
                                        results.push(result);
                                        if(i == senderlist.length-1){
                                            callback(success_statuscode, results);
                                        }
                                    }
                                });
                            })(i);
                        }
                    }
                    db.close()
                })
            }
        })
    }
}
module.exports = PrivateChatDBOper;