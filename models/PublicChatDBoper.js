/**
 * Created by shuang on 2/26/17.
 */
"use strict";

var MongoClient = require("mongodb").MongoClient;
var DBConfig = require("./DBConfig");
let dbconfig = new DBConfig();
var url = dbconfig.getURL();
//var url = "mongodb://root:1234@ds137730.mlab.com:37730/esnsv7";

var db_err_msg = "Database Error";

class PublicChatDBoper {

    InsertMessage (sender, receiver, message, type, postTime,emergencystatus, callback) {
        //connect to database
        MongoClient.connect(url, function (err, db) {
            if (err) {
                console.log("Error:"+ err);
                callback(400, db_err_msg);// DB Error. Here error of connecting to db
            }
            var collection = db.collection("MESSAGES");
            //insert into table
            var data = [{"sender":sender,"receiver":receiver, "message": message, "type": type, "postTime": postTime,"emergencystatus":emergencystatus}];
            collection.insert(data, callback);
            db.close();
        });
    }

    LoadPublicMessage (callback) {
        MongoClient.connect(url, function(err, db) {
            if (err) {
                console.log("Error:" + err);
                callback(400, db_err_msg);// DB Error. Here error of connecting to db
            }
            var collection = db.collection("MESSAGES");
            collection.find({"type": "public"}).toArray(function(err, results){
                if(err)
                {
                    console.log("Error:"+ err);
                    callback(err, "Database error");
                }else {
                    var datas = [];
                    results.forEach(function(result){
                        var data = {};
                        data["username"] = result.sender;
                        data["pubmsg"] = result.message;
                        data["timestamp"] = result.postTime;
                        data["emergencystatus"] = result.emergencystatus;
                        datas.push(data);
                    });
                    //var jsonString = JSON.stringify(datas);
                    callback(err,datas);
                }
            });
            db.close();
        });
    }
}

let publicchatdboper = new PublicChatDBoper();

module.exports = {
    InsertMessage: publicchatdboper.InsertMessage,
    LoadPublicMessage: publicchatdboper.LoadPublicMessage
};
