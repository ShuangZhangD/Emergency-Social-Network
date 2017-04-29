/**
 * Created by shuang on 2/26/17.
 */
"use strict";

var MongoClient = require("mongodb").MongoClient;
var Message = require("./Message.js");
var db_err_msg = "Database Error";
var db_err_statuscode = 400;
var success_statuscode = 200;
//var url = "mongodb://root:1234@ds137730.mlab.com:37730/esnsv7";

class PublicChatDBoper {

    InsertMessage (sender, receiver, message, type, postTime,emergencystatus, accountstatus,url, callback) {
        //connect to database
        MongoClient.connect(url, function (err, db) {
            if (err) {
                //console.log("Error:"+ err);
                callback(400, db_err_msg);// DB Error. Here error of connecting to db
            }
            var collection = db.collection("MESSAGES");
            //insert into table
            var data = [{"sender":sender,"receiver":receiver, "message": message, "type": type, "postTime": postTime,"emergencystatus":emergencystatus, "accountstatus":accountstatus}];
            collection.insert(data, callback);
            db.close();
        });
    }

    LoadPublicMessage (url, callback) {
        MongoClient.connect(url, function(err, db) {
            if (err) {
                //console.log("Error:" + err);
                callback(400, db_err_msg);// DB Error. Here error of connecting to db
            }
            var collection = db.collection("MESSAGES");
            collection.find({"type": "public"}).toArray(function(err, results){
                if(err)
                {
                    //console.log("Error:"+ err);
                    callback(err, "Database error");
                }else {
                    var datas = [];
                    results.forEach(function(result){
                        var data = {};
                        data["username"] = result.sender;
                        data["pubmsg"] = result.message;
                        data["timestamp"] = result.postTime;
                        data["emergencystatus"] = result.emergencystatus;
                        data["accountstatus"] = result.accountstatus;
                        if(result.accountstatus=="Active") {
                            datas.push(data);
                        }
                    });
                    //var jsonString = JSON.stringify(datas);
                    callback(err,datas);
                }
                db.close();
            });
        });
    }

    SearchPublicMessages(words, url, callback) {
        MongoClient.connect(url, function (err, db) {
            if (err) {
                callback(db_err_statuscode, db_err_msg);
            }// DB Error. Here error of connecting to db
            else {
                let MSG = new Message("", "", "", "", "", "", "");
                MSG.getAllPublicMessagesForSearch(db, words, function (results, err) {
                    console.log(err);
                    callback(success_statuscode, results);
                    db.close();
                });
            }
        });
    }
}

let publicchatdboper = new PublicChatDBoper();

module.exports = {
    InsertMessage: publicchatdboper.InsertMessage,
    LoadPublicMessage: publicchatdboper.LoadPublicMessage,
    SearchPublicMessages: publicchatdboper.SearchPublicMessages
};
