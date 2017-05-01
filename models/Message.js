/**
 * Created by Ling on 2017/3/18.
 */
"use strict";
class Message {

    // Constructor for initializing values for a new message
    constructor(sender, receiver, type, message, postTime, EmergencyStatus, ReadStatus) {
        this.sender = sender;
        this.receiver = receiver;
        this.type = type;
        this.message = message;
        this.postTime = postTime;
        this.EmergencyStatus = EmergencyStatus;
        this.ReadStatus = ReadStatus;
    }

    // Method to insert a new message, takes the "MESSAGE" collection as the parameter
    // If the receiverid is null, it indicates a message that was shared publicly
    // The type can have values "Public", "Private" or "GroupName"
    insertMessage(db, callback) {
        this.collection = db.collection("MESSAGES");
        this.collection.insert({
            "sender": this.sender,
            "receiver": this.receiver,
            "type": this.type,
            "message": this.message,
            "postTime": this.postTime,
            "emergencystatus": this.EmergencyStatus,
            "senderaccountstatus" : "Active",
            "receiveraccountstatus": "Active",
            "ReadStatus": this.ReadStatus
        }, function (err, results) {
            console.log(err);
            callback(results, null);

        });
    }

     // delete messages for particular conversation - needed for Inform Emergency Contact use case
     deleteMessages(db, username, callback) {
         this.collection = db.collection("MESSAGES");
         this.collection.remove({"sender" : "EmergencyAdmin", "receiver" : username}, function(err, results) {
             callback(results, null);
         });
     }

    //update all private messages between sender and receiver to be read
    updateReadStatus(db, callback) {
        this.collection = db.collection("MESSAGES");
        this.collection.updateMany({
            "sender": this.sender,
            "receiver": this.receiver
        }, {$set: {"ReadStatus": "read"}}, function (err, results) {
            console.log(err);
            callback(results, null);
        });
    }

    //load all private meaages between sender and receiver
    loadPrivateHistoryMsg(db, callback) {
        this.collection = db.collection("MESSAGES");
        this.collection.find({
            "sender": { $in: [this.sender, this.receiver] },
            "receiver": { $in: [this.sender, this.receiver] },
            "senderaccountstatus" : "Active",
            "receiveraccountstatus" : "Active",
            "type": "private"
        }).toArray(function (err, results) {
            var datas = [];
            console.log(err);
            results.forEach(function (result) {
                var data = {};
                data["receiver"] = result.receiver;
                data["sender"] = result.sender;
                data["private_msg"] = result.message;
                data["emergency_status"] = result.emergencystatus;
                data["timestamp"] = result.postTime;
                datas.push(data);
            });
            //var jsonString = JSON.stringify(datas);
            callback(datas, null);
        });
    }
    loadGroupHistoryMsg(db, callback) {
        this.collection = db.collection("MESSAGES");
        this.collection.find({
            "receiver": this.receiver ,
            "type": "group"
        }).toArray(function (err, results) {
            console.log(err);
            var datas = [];
            results.forEach(function (result) {
                var data = {};
                data["sender"] = result.sender;
                data["receiver"] = result.receiver;
                data["timestamp"] = result.postTime;
                data["emergency_status"] = result.emergencystatus;
                data["group_msg"] = result.message;
                datas.push(data);
            });
            //var jsonString = JSON.stringify(datas);
            callback(datas, null);
        });
    }
    //get how many private unread msg between sender and receiver
    getCount_PrivateUnreadMsg(db, sender, receiver, callback){
        this.collection = db.collection("MESSAGES");
        this.collection.find({
            "sender" : sender,
            "receiver": receiver,
            "type" : "private",
            "senderaccountstatus" : "Active",
            "receiveraccountstatus" : "Active",
            "ReadStatus": "unread"
        }).toArray(function (err, results) {
            callback(results.length, null);
        });
    }

    //get name list of senders of unread private msg
    getUnreadMsgSenderList(db, callback){
        this.collection = db.collection("MESSAGES");
        this.collection.distinct("sender",{
            "receiver":this.receiver,
            "senderaccountstatus" : "Active",
            "receiveraccountstatus" : "Active",
            "ReadStatus": "unread"
        }, function (err, results) {
            console.log(err);
            callback(results, null);
        });
    }

    //get name list of sender list who have private msg with receiver
    getPrivateMsgSenderList(db, callback){
        var receiver = this.receiver;
        this.collection = db.collection("MESSAGES");
        this.collection.aggregate([{$match: {"senderaccountstatus" : "Active", "receiveraccountstatus" : "Active", "type":"private", $or: [{"receiver":receiver}, {"sender":receiver}]}}, {$group: {"_id": {sender: "$sender",receiver: "$receiver"} }}], function (err, results) {
            console.log(err);
            var userlist = [];
            results.forEach(function(result){
                var sendername = result["_id"]["sender"];
                if(userlist.indexOf(sendername) == -1 && sendername != receiver){
                    userlist.push(sendername);
                }
                var receivername = result["_id"]["receiver"];
                if(userlist.indexOf(receivername) == -1 && receivername != receiver){
                    userlist.push(receivername);
                }
            });
            callback(userlist,null);
        });
    }

    getAllMessagesForSearch(db, username, words, callback) {
        this.collection = db.collection("MESSAGES");
        var searchTerm = words[0];
        var datas=[];
        words.forEach(function(word) {
            searchTerm=searchTerm+"|"+word;
        });
        var regExWord = new RegExp(".*" + searchTerm + ".*");
        this.collection.find({$or: [{"sender" : username}, {"receiver":username}], "message":  regExWord, "type":"private", "senderaccountstatus" : "Active", "receiveraccountstatus" : "Active"}).toArray(function(err, results) {
            console.log(err);
            results.forEach(function (result) {
                var data = {};
                data["sender"] = result.sender;
                data["receiver"] = result.receiver;
                data["message"] = result.message;
                data["timestamp"] = result.postTime;
                data["emergency_status"] = result.emergencystatus;
                datas.push(data);
            });
            callback(datas, null);
        });
    }

    getAllPublicMessagesForSearch(db, words, callback) {
        this.collection = db.collection("MESSAGES");
        var datas=[];
        var searchTerm = words[0];
        words.forEach(function(word) {
            searchTerm=searchTerm+"|"+word;
        });
        var regExWord = new RegExp(".*" + searchTerm + ".*");
        this.collection.find({ "message":  regExWord, "type":"public", "senderaccountstatus" : "Active"}).toArray(function(err, results) {
            console.log(err);
            results.forEach(function (result) {
                var data = {};
                data["pubmsg"] = result.message;
                data["username"] = result.sender;
                data["timestamp"] = result.postTime;
                data["emergencystatus"] = result.emergencystatus;
                datas.push(data);
            });
            callback(datas, null);
        });
    }
}
module.exports = Message;
