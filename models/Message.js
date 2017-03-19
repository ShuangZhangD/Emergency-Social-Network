/**
 * Created by Ling on 2017/3/18.
 */
'use strict';
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
        this.collection = db.collection('MESSAGES');
        this.collection.insert({
            "sender": this.sender,
            "receiver": this.receiver,
            "type": this.type,
            "message": this.message,
            "postTime": this.postTime,
            "EmergencyStatus": this.EmergencyStatus,
            "ReadStatus": this.ReadStatus
        }, function (err, results) {
            if (err) {
                console.log('Error inserting the message ' + err);
                callback(null, err);
            }
            else {
                callback(results, null);
            }
        });
    }


    // Method to display all the messages
    displayMessages(db, callback) {
        this.collection = db.collection('MESSAGES');
        this.collection.find().toArray(function (err, results) {
            if (err) {
                console.dir('Error inserting the message ' + err);
                callback(null, err);
            }
            else {
                console.dir(results);
                callback(results, null);
            }
        });
    }

    //update all private messages between sender and receiver to be read
    updateReadStatus(db, callback) {
        this.collection = db.collection('MESSAGES');
        this.collection.updateMany({
            "sender": this.sender,
            "receiver": this.receiver
        }, {$set: {"ReadStatus": "read"}}, function (err, results) {
            if (err) {
                console.log('Error updating read status' + err);
                callback(null, err);
            }
            else {
                callback(results, null);
            }
        })
    }

    //load all private meaages between sender and receiver
    loadPrivateHistoryMsg(db, callback) {
        this.collection = db.collection('MESSAGES');
        this.collection.find({
            "sender": this.sender,
            "receiver": this.receiver,
            "type": "private"
        }).toArray(function (err, results) {
            if (err) {
                console.log('Error when loading private history msg:' + err);
                callback(null, err);
            } else {
                var datas = [];
                results.forEach(function (result) {
                    var data = {};
                    data["sender"] = result.sender;
                    data["receiver"] = result.receiver;
                    data["private_msg"] = result.message;
                    data["timestamp"] = result.postTime;
                    data["emergency_status"] = result.EmergencyStatus;
                    datas.push(data);
                })
                //var jsonString = JSON.stringify(datas);
                callback(datas, null);
            }
        })
    }

    //get how many unread msg of receiver
    getCount_AllUnreadMsg(db, callback){
        this.collection = db.collection('MESSAGES');
        this.collection.find({
            "receiver": this.receiver,
            "ReadStatus": "unread"
        }).toArray(function (err, results) {
           if(err) callback(null, err);
           else callback(results.length, null)
        })
    }

    //get how many private unread msg of receiver
    getCount_AllPrivateUnreadMsg(db, callback){
        this.collection = db.collection('MESSAGES');
        this.collection.find({
            "receiver": this.receiver,
            "type" : "private",
            "ReadStatus": "unread"
        }).toArray(function (err, results) {
            if(err) callback(null, err);
            else callback(results.length, null)
        })
    }

    //get how many private unread msg between sender and receiver
    getCount_PrivateUnreadMsg(db, sender, receiver, callback){
        this.collection = db.collection('MESSAGES');
        this.collection.find({
            "sender" : sender,
            "receiver": receiver,
            "type" : "private",
            "ReadStatus": "unread"
        }).toArray(function (err, results) {
            if(err) callback(null, err);
            else callback(results.length, null)
        })
    }

    //get name list of senders of unread private msg
    getUnreadMsgSenderList(db, callback){
        this.collection = db.collection('MESSAGES');
        this.collection.distinct("sender",{
            "receiver":this.receiver,
            "ReadStatus": "unread"
        }, function (err, results) {
            if(err) callback(null, err);
            else {
                callback(results, null);
            }
        })
    }

    get_LatestPrivateUnreadMsg(db, sender, receiver, callback){
        this.collection = db.collection('MESSAGES');
        this.collection.find({
            "sender" : sender,
            "receiver": receiver,
            "type" : "private",
            "ReadStatus": "unread"
        }).limit(1).sort({$natural:-1}).toArray(function (err, result) {
            if(err) callback(null, err);
            else {
                var data = {};
                data["sender"] = result[0].sender;
                data["receiver"] = result[0].receiver;
                data["private_msg"] = result[0].message;
                data["timestamp"] = result[0].postTime;
                data["emergency_status"] = result[0].EmergencyStatus;

                callback(data, null)
            }
        })
    }
}
module.exports = Message;
