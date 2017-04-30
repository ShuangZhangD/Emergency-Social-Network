"use strict";
var MongoClient = require("mongodb").MongoClient;
var User = require("./User.js");

//var url = "mongodb://root:1234@ds137730.mlab.com:37730/esnsv7";
//var url = "mongodb://localhost:27017/test";

var db_err_msg = "Database Error";
var db_err_statuscode = 400;
var user_not_exist_statuscode = 401;
var user_not_exist_msg = "Username not Exist";
var pwd_incorrect_statuscode = 402;
var signup_username_exist_statuscode = 405;
var signup_username_exist_msg = "Username has existed!";
var pwd_incorrect_msg = "Password Incorrect";
var success_statuscode = 200;

class JoinCommunityDBOper {
    Login (username, password, url, callback){
        MongoClient.connect(url, function(err, db) {
            if(err) {
                //console.log("Error:"+ err);
                callback(db_err_statuscode, db_err_msg);
            }// DB Error. Here error of connecting to db
            else {
                //check if the user exist
                let new_user = new User(username, password, "online", "");
                new_user.checkUser(db, username, function(result, err) {
                    if(result.length == 0){
                        //console.log("username not exist");
                        console.log(err);
                        callback(user_not_exist_statuscode, user_not_exist_msg);
                    }
                    //if username exist
                    else if (result[0].accountstatus != "Active") {
                        callback(403, "User Inactive.");
                    }
                    else {
                        new_user.checkPassword(db, username, password, function(pwdres, err){
                            console.log(err);
                            if (pwdres.length == 0) {
                                //password incorrect
                                callback(pwd_incorrect_statuscode, pwd_incorrect_msg);//Password Incorrect Error
                            }
                            else {
                                var privilegelevel = pwdres[0].privilegelevel;
                                new_user.updateStatus(db, username, "online", function(updateres, err) {console.log(err);});
                                new_user.displayStatusUsers(db, "online", function(results, err) {
                                    console.log(err);
                                    var userlist = [];
                                    results.forEach(function(result) {
                                        userlist.push(result.username);
                                    });
                                    callback(success_statuscode, {userlist: userlist, privilegelevel: privilegelevel});
                                });
                            }
                            db.close();
                        });
                    }
                });
            }
        });//end of database operation
    }

    AddDB (username, password, url, callback) {
        MongoClient.connect(url, function (err, db) {
            if (err) {
                callback(db_err_statuscode, db_err_msg);// DB Error. Here error of connecting to db
            }
            else {
                let new_user = new User(username, password, "online");
                new_user.checkUser(db, username, function(result, err) {
                    console.log(err);
                    if (result.length > 0) {
                        callback(signup_username_exist_statuscode, signup_username_exist_msg);
                        db.close();
                    }
                    else {
                        new_user.createUser(db, function(result, err){
                            console.log(err);
                            new_user.displayStatusUsers(db, "online", function(results, err) {
                                console.log(err);
                                var userlist = [];
                                results.forEach(function (result) {
                                    userlist.push(result.username);
                                });
                                callback(success_statuscode, userlist);
                                db.close();
                            });
                        });
                    } // if (result>0)
                }); // checkUser
            }
        });//end of database operation
    }

    GetAllUsers (url, callback){
        MongoClient.connect(url, function(err, db) {
            if(err){
                //console.log("Error:"+ err);
                callback(db_err_statuscode, db_err_msg);// DB Error. Here error of connecting to db
            }
            //insert information into database
            let new_user = new User("", "", "");
            new_user.displayStatusUsers(db, "online", function(results, err) {
                console.log(err);
                var userlist1 = [];
                results.forEach(function (result) {
                    userlist1.push(result.username);
                });

                new_user.displayStatusUsers(db, "offline", function(results, err) {
                    console.log(err);
                    var userlist2 = [];
                    results.forEach(function (result) {
                        userlist2.push(result.username);
                    });
                    callback(success_statuscode, userlist1, userlist2);
                    db.close();
                });
            });
        });//end of database operation
    }

    Logout (username, url, callback){
        MongoClient.connect(url, function(err, db) {
            if(err){
                //console.log("Error:"+ err);
                callback(db_err_statuscode, db_err_msg);// DB Error. Here error of connecting to db
            }
            let new_user = new User("username", "", "offline");

            new_user.updateStatus(db, username, "offline", function(result, err){
                console.log(err);
                callback(success_statuscode, result);
            });
            db.close();
        });//end of database operation
    }

    GetAllUsernameAndEmergencyStatus(url, callback){
        MongoClient.connect(url, function(err, db) {
            if (err) {
                //console.log("Error:" + err);
                callback(db_err_statuscode, db_err_msg);// DB Error. Here error of connecting to db
            }
            else {
                let new_user = new User("", "", "", "");
                new_user.getAllUsernameAndEmergencyStatus(db, function(results, err){
                    console.log(err);
                    callback(success_statuscode, results);
                });
            }
        });
    }

    GetAllUsernameAndAccountstatus(url, callback){
        MongoClient.connect(url, function(err, db) {
            if (err) {
                //console.log("Error:" + err);
                callback(db_err_statuscode, db_err_msg);// DB Error. Here error of connecting to db
            }
            else {
                let new_user = new User("", "", "", "");
                new_user.getAllUsernameAndAccountstatus(db, function(results, err){
                    console.log(err);
                    callback(success_statuscode, results);
                });
            }
        });
    }

    RemoveUser(username, url, callback) {
        MongoClient.connect(url, function(err, db) {
            if (err) {
                //console.log("Error:" + err);
                callback(db_err_statuscode, db_err_msg);// DB Error. Here error of connecting to db
            }
            else {
                let user = new User(username, "", "", "");
                user.removeUser(db, function(results, err){
                    console.log(err);
                    callback(success_statuscode, results);
                });
            }
        });
    }
}

let dboper = new JoinCommunityDBOper();

module.exports = {
    Login: dboper.Login,
    AddDB: dboper.AddDB,
    GetAllUsers: dboper.GetAllUsers,
    Logout: dboper.Logout,
    GetUserEmergencyStatus: dboper.GetUserEmergencyStatus,
    GetAllUsernameAndEmergencyStatus: dboper.GetAllUsernameAndEmergencyStatus,
    GetAllUsernameAndAccountstatus: dboper.GetAllUsernameAndAccountstatus,
    RemoveUser: dboper.RemoveUser
};
