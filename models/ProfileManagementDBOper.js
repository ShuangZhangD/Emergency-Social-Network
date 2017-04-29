"use strict";
var MongoClient = require("mongodb").MongoClient;
var md5 = require("md5");

//var url = "mongodb://localhost:27017/test";
//var url = "mongodb://root:1234@ds137730.mlab.com:37730/esnsv7";

var db_err_msg = "Database Error";

class ProfileManagementDBoper{

    updateProfileForUser(profileusername, data, url, callback){
        //connect to database
        var accountstatus = data["accountstatus"];
        var privilegelevel = data["privilegelevel"];
        var password = md5(data["password"]);
        var newusername = data["newusername"];
        MongoClient.connect(url, function (err, db) {
            //console.log("Connected to "+url+" Successfully");
            if (err) {
                //console.log("Error:"+ err);
                callback(400, db_err_msg);// DB Error. Here error of connecting to db
            }
            else {
                var usercollection = db.collection("USERS");
                usercollection.update({"username": profileusername}, {$set :{"accountstatus":accountstatus, "privilegelevel": privilegelevel, "password" : password, "username": newusername}},callback);
                db.close();
            }
        });
    }

    getProfileForUser(profileusername, url, callback){
        MongoClient.connect(url, function(err, db){
            if (err) {
                //console.log("Error:"+ err);
                callback(400, db_err_msg);// DB Error. Here error of connecting to db
            }
            else {
                var usercollection = db.collection("USERS");
                // To do here, invoke dbmethods to get particular user"s status
                var data={};
                usercollection.find({"username": profileusername}).toArray(function(err, results){
                      results.forEach(function(result){
                          data["newusername"] = result.username;
                          data["password"] = result.password;
                          data["accountstatus"] = result.accountstatus;
                          data["privilegelevel"] = result.privilegelevel;
                      });
                      callback(err, data);
                });
            }
            //db.close();
        });
    }
}

let pmdboper = new ProfileManagementDBoper();

module.exports = {
    updateProfileForUser : pmdboper.updateProfileForUser,
    getProfileForUser : pmdboper.getProfileForUser
};
