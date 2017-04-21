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
            "emergencystatus": this.EmergencyStatus,
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
        console.log("=======IN MESSAGE UPDATEREADSTATUS====")
        this.collection = db.collection('MESSAGES');
        console.log("MARKREAD SENDER IS "+this.sender)
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
            "sender": { $in: [this.sender, this.receiver] },
            "receiver": { $in: [this.sender, this.receiver] },
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
                    data["emergency_status"] = result.emergencystatus;
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

    //get name list of sender list who have private msg with receiver
    getPrivateMsgSenderList(db, callback){
        var receiver = this.receiver;
        this.collection = db.collection('MESSAGES');
        /*this.collection.distinct("sender",{
            //"receiver":this.receiver,
            $or: [{"receiver":this.receiver}, {"sender":this.receiver}],
            "type" : "private"
        }, function (err, results) {*/
        this.collection.aggregate([{$match: {"type":"private", $or: [{"receiver":receiver}, {"sender":receiver}]}}, {$group: {"_id": {sender: "$sender",receiver: "$receiver"} }}], function (err, results) {
            if(err) callback(null, err);
            else {
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
                //var loc_receiver = results.indexOf(receiver)
                //if(loc_receiver != -1)results.splice(loc_receiver,1)
                callback(userlist,null)
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

    getAllMessagesForSearch(db, username, words, callback) {
      this.collection = db.collection('MESSAGES');
      var datas=[];
      var searchTerm = words[0];
      words.forEach(function(word) {
        searchTerm=searchTerm+"|"+word;
      });
        var regExWord = new RegExp(".*" + searchTerm + ".*");
//        this.collection.find({$or: [{"sender" : username}, {"receiver":username}], "message": { $regex: regExWord, $options: "i"}}).toArray(function(err, results) {
  this.collection.find({$or: [{"sender" : username}, {"receiver":username}], "message":  regExWord}).toArray(function(err, results) {
        if(err) {
            console.log("Error when retrieving messages for search terms");
            callback(null, err);
          }
          else {
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
          }
        });


    }
}
module.exports = Message;
