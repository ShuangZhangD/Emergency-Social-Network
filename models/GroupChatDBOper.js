/**
 * Created by Ling on 2017/3/18.
 */
"use strict";
var MongoClient = require("mongodb").MongoClient;
var Message = require("./Message.js");

var db_err_msg = "Database Error";
var db_err_statuscode = 400;
var success_statuscode = 200;

class GroupChatDBOper {

    constructor(group, username, url) {
        this.group = group;
        this.username = username;
        this.url = url;
    }

    getAllGroupList (callback) {
        MongoClient.connect(this.url, function(err, db) {
            //console.log("Load Announcement connect to "+ url);
            if (err) {
                callback(db_err_statuscode, db_err_msg);// DB Error. Here error of connecting to db
            }
            var collection = db.collection("GROUPS");
            collection.distinct("group",function(err, results){
                var datas = [];
                results.forEach(function(result){
                    var data = {};
                    data["group"] = result.group;
                    datas.push(data);
                });
                callback(err,datas);
                db.close();
            });
        });
    }

    getMyGroupList (callback) {
        var username = this.username;
        MongoClient.connect(this.url, function(err, db) {
            //console.log("Load Announcement connect to "+ url);
            if (err) {
                callback(400, db_err_msg);// DB Error. Here error of connecting to db
            }
            var collection = db.collection("GROUPS");
            collection.find({"username": username},{group:1}).toArray(function(err, results){
                var datas = [];
                results.forEach(function(result){
                    var data = {};
                    data["group"] = result.group;
                    datas.push(data);
                });
                callback(err,datas);
                db.close();
            });
        });
    }

    joinGroup (callback) {
        var group = this.group;
        var username = this.username;
        //connect to database
        MongoClient.connect(this.url, function (err, db) {

            if (err) {
                //console.log("Error:"+ err);
                callback(db_err_statuscode, db_err_msg);// DB Error. Here error of connecting to db
            }
            else {
                var collection = db.collection("GROUPS");
                //insert into table
                var data = [{"group": group,"username": username}];
                collection.insert(data, callback);
                db.close();
            }
        });
    }

    leaveGroup (callback) {
        var group = this.group;
        var username = this.username;
        //connect to database
        MongoClient.connect(this.url, function (err, db) {

            if (err) {
                //console.log("Error:"+ err);
                callback(db_err_statuscode, db_err_msg);// DB Error. Here error of connecting to db
            }
            else {
                var collection = db.collection("GROUPS");
                //insert into table
                var data = [{"group": group,"username": username}];
                collection.insert(data, callback);
                db.close();
            }
        });
    }

    createGroup (callback) {
        var group = this.group;
        var username = this.username;
        //connect to database
        MongoClient.connect(this.url, function (err, db) {

            if (err) {
                //console.log("Error:"+ err);
                callback(db_err_statuscode, db_err_msg);// DB Error. Here error of connecting to db
            }
            else {
                var collection = db.collection("GROUPS");
                //insert into table
                var data = [{"group": group,"username": username}];
                collection.insert(data, callback);
                db.close();
            }
        });
    }


    InsertMessage(message, callback) {
        MongoClient.connect(this.url, function (err, db) {
            if (err) {
                //console.log("Error:" + err);
                callback(db_err_statuscode, db_err_msg);
            }// DB Error. Here error of connecting to db
            else {
                var sender = message.sender;
                var receiver = message.receiver;
                var msg = message.groupMsg;
                var status = message.emergency_status;
                var time = message.timestamp;
                let MSG = new Message(sender, receiver, "group", msg, time, status, "unread");
                MSG.insertMessage(db, function (msgres, err) {
                    console.log(err);
                    callback(success_statuscode, null);
                });
                db.close();
            }
        });
    }

    /*
     * Load all private history message
     * Also update all unread private msg to be read
     */
    LoadHistoryMsg(message,callback) {
        var group = this.group;
        MongoClient.connect(this.url, function (err, db) {
            if (err) {
                callback(db_err_statuscode, db_err_msg);
            }// DB Error. Here error of connecting to db
            else {
                //set all <sender,receiver> private messages to be read
                let MSG = new Message("", group, "group", "", "", "", "");
                    console.log(err);
                    //load all private messages between sender and receiver
                    MSG.loadGroupHistoryMsg(db, function (results, err) {
                        console.log(err);
                        callback(success_statuscode, results);
                        db.close();
                    });
            }
        });
    }


}
module.exports = GroupChatDBOper;
