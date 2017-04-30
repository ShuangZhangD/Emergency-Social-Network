"use strict";
var MongoClient = require("mongodb").MongoClient;
var md5 = require("md5");
var User = require("./User.js");

//var url = "mongodb://localhost:27017/test";
//var url = "mongodb://root:1234@ds137730.mlab.com:37730/esnsv7";

var db_err_msg = "Database Error";
var user_already_exist_statuscode = 405;

class ProfileManagementDBoper{

    updateProfileForUser(profileusername, data, url, callback){
        //connect to database
        var accountstatus = data["accountstatus"];
        var privilegelevel = data["privilegelevel"];
        var password = data["newpassword"];
        var profilepassword = data["profilepassword"];
        var newusername = data["newusername"];
        if(profilepassword != password) {
            // Need to compute hash only if password is changed
            password = md5(password);
        }
        MongoClient.connect(url, function (err, db) {
            //console.log("Connected to "+url+" Successfully");
            if (err) {
                //console.log("Error:"+ err);
                callback(400, db_err_msg);// DB Error. Here error of connecting to db
            }
            else {
                let new_user = new User(newusername, password, "online", "");
                new_user.checkUser(db, newusername, function(result, err) {
                    if(result.length == 0 || newusername == profileusername) {
                        var usercollection = db.collection("USERS");
                        usercollection.update({"username": profileusername}, {$set :{"accountstatus":accountstatus, "privilegelevel": privilegelevel, "password" : password, "username": newusername}},callback);
                        db.close();
                    }
                    else {
                        callback(user_already_exist_statuscode, "username already in use");
                    }
                });
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
                          data["newpassword"] = result.password;
                          data["accountstatus"] = result.accountstatus;
                          data["privilegelevel"] = result.privilegelevel;
                      });
                      callback(err, data);
                });
            }
            //db.close();
        });
    }

    updateName(profileusername, data, url, callback){
        //connect to database
        console.log("In update name in dboper");
        var accountstatus = data["accountstatus"];
        var privilegelevel = data["privilegelevel"];
        var password = data["newpassword"];
        var profilepassword = data["profilepassword"];
        var newusername = data["newusername"];
        console.log("In update name in dboper");
        MongoClient.connect(url, function (err, db) {
            //console.log("Connected to "+url+" Successfully");
            if (err) {
                console.log("Error:"+ err);
                callback(400, db_err_msg);// DB Error. Here error of connecting to db
            }
            else {
                console.log("In updateName in ProfileManagementCtrlDB");

                var announcementcollection = db.collection("announcement");
                //insert into table
                announcementcollection.update({"username": profileusername}, {$set :{"username": newusername}},function (err, results) {
                    if (err) {
                        console.log("Error:"+ err);
                    }
                    else {
                        console.log("In updateName in ANN");

                        var messagecollection = db.collection("MESSAGES");
                        messagecollection.update({"sender": profileusername}, {$set :{"sender": newusername}},function (err, results) {
                            if(err){
                                console.log("Error:"+ err);
                            }else{
                                console.log("In updateName in Messages");
                                var messagecollection = db.collection("MESSAGES");
                                messagecollection.update({"receiver": profileusername}, {$set :{"receiver": newusername}},callback);
                                db.close();
                            }
                        });
                    }
                });
            }
        });
    }

    updateAccountStatus(profileusername, data, url, callback){
        //connect to database
        var accountstatus = data["accountstatus"];
        var privilegelevel = data["privilegelevel"];
        var password = data["newpassword"];
        var profilepassword = data["profilepassword"];
        var newusername = data["newusername"];
        MongoClient.connect(url, function (err, db) {
            //console.log("Connected to "+url+" Successfully");
            if (err) {
                //console.log("Error:"+ err);
                callback(400, db_err_msg);// DB Error. Here error of connecting to db
            }
            else {
                var announcementcollection = db.collection("announcement");
                //insert into table
                announcementcollection.update({"username": profileusername}, {$set :{"accountstatus": accountstatus}},function (err, results) {
                    if (err) {

                    }
                    else {
                        var messagecollection = db.collection("MESSAGES");
                        messagecollection.update({"sender": profileusername}, {$set :{"accountstatus": accountstatus}},function (err, results) {
                            if(err){

                            }else{
                                var messagecollection = db.collection("MESSAGES");
                                messagecollection.update({"receiver": profileusername}, {$set :{"accountstatus": accountstatus}},callback);
                                db.close();
                            }
                        });
                    }
                });
            }

        });
    }
}

let pmdboper = new ProfileManagementDBoper();

module.exports = {
    updateProfileForUser : pmdboper.updateProfileForUser,
    getProfileForUser : pmdboper.getProfileForUser,
    updateName : pmdboper.updateName,
    updateAccountStatus : pmdboper.updateAccountStatus
};
