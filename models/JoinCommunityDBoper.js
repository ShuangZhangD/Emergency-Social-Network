'use strict';
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var express = require('express');
var User = require('./User.js');
var DBConfig = require('./DBConfig');
let dbconfig = new DBConfig();
var url = dbconfig.getURL();
//var url = 'mongodb://root:1234@ds137730.mlab.com:37730/esnsv7';
//var url = 'mongodb://localhost:27017/test';

var db_err_msg = "Database Error";
var db_err_statuscode = 400;
var user_not_exist_statuscode = 401;
var user_not_exist_msg = "Username not Exist";
var pwd_incorrect_statuscode = 402;
var pwd_incorrect_msg = "Password Incorrect";
var success_statuscode = 200;

class JoinCommunityDBOper {
    Login (username, password, callback){
        MongoClient.connect(url, function(err, db) {
        if(err) {
            console.log('Error:'+ err);
            callback(db_err_statuscode, db_err_msg)
        }// DB Error. Here error of connecting to db
        else {
            console.log("Connected correctly to server.");
            //check if the user exist
            let new_user = new User(username, password, "online", "");
            new_user.checkUser(db, username, function(result, err){
                if(err){
                    callback(db_err_statuscode, db_err_msg);
                }
                //if username not exist
                if(result.length == 0){
                    console.log("username not exist");
                    callback(user_not_exist_statuscode, user_not_exist_msg);
                }
                //if username exist
                else{
                    console.log("Username found");
                    console.log(result);
                    new_user.checkPassword(db, username, password, function(pwdres, err){
                        if (err) callback(db_err_statuscode, db_err_msg);//DB error
                        else{
                            if (pwdres.length == 0) {
                                //password incorrect
                                callback(pwd_incorrect_statuscode, pwd_incorrect_msg);//Password Incorrect Error
                            }
                            else{
                                new_user.updateStatus(db, username, "online", function(updateres, err){
                                    if(err) callback(db_err_statuscode, db_err_msg);
                                });
                                new_user.displayStatusUsers(db, "online", function(results, err){
                                    if(err) callback(db_err_statuscode, db_err_msg);
                                    else{
                                        var userlist = [];
                                        results.forEach(function(result){
                                            userlist.push(result.username);
                                        });
                                        callback(success_statuscode, userlist);
                                    }
                                });
                            }
                            db.close();
                        }
                    });
                }
            });
        }
        });//end of database operation
    };

    AddDB (username, password, callback) {
        MongoClient.connect(url, function (err, db) {
            if (err) {
                console.log('Error:'+ err);
                callback(db_err_statuscode, db_err_msg);// DB Error. Here error of connecting to db
            }
            console.log("Connected correctly to server.");
            let new_user = new User(username, password, "online");
            new_user.createUser(db, function(result, err){
               if(err) callback(db_err_statuscode, db_err_msg);
               else{
                   new_user.displayStatusUsers(db, "online", function(results, err) {
                       if (err) callback(db_err_statuscode, db_err_msg);
                       else {
                           var userlist = [];
                           results.forEach(function (result) {
                               userlist.push(result.username);
                           });
                           callback(success_statuscode, userlist);
                       }
                   });
               }
                db.close();
            });

        });//end of database operation
    };

    GetAllUsers (callback){
        MongoClient.connect(url, function(err, db) {
            if(err){
                console.log('Error:'+ err);
                callback(db_err_statuscode, db_err_msg);// DB Error. Here error of connecting to db
            }
            console.log("Connected correctly to server.");
            //insert information into database
            let new_user = new User("", "", "");
            /*new_user.displayUsers(db, function(results, err){
                if (err) callback(db_err_statuscode, db_err_msg);
                else {
                    var userlist = [];
                    results.forEach(function (result) {
                        userlist.push(result.username);
                    });
                    callback(success_statuscode, userlist);
                }
                db.close();
            });*/
            new_user.displayStatusUsers(db, "online", function(results, err) {
                if (err) callback(db_err_statuscode, db_err_msg, null);
                else {
                    var userlist1 = [];
                    results.forEach(function (result) {
                        userlist1.push(result.username);
                    });

                    new_user.displayStatusUsers(db, "offline", function(results, err) {
                        if (err) callback(db_err_statuscode, db_err_msg, null);
                        else {
                            var userlist2 = [];
                            results.forEach(function (result) {
                                userlist2.push(result.username);
                            });
                            callback(success_statuscode, userlist1, userlist2);
                        }
                        db.close();
                    });

                    //callback(success_statuscode, userlist);
                }
            });
        });//end of database operation
    };

    Logout (username, callback){
        MongoClient.connect(url, function(err, db) {
            if(err){
                console.log('Error:'+ err);
                callback(db_err_statuscode, db_err_msg);// DB Error. Here error of connecting to db
            }
            console.log("Connected correctly to server.");
            let new_user = new User("username", "", "offline");

            new_user.updateStatus(db, username, "offline", function(result, err){
                if(err) callback(db_err_statuscode, db_err_msg);
                else callback(success_statuscode, result);
            });
            db.close();
        });//end of database operation
    };

    GetUserEmergencyStatus (userlist, callback){
        MongoClient.connect(url, function(err, db) {
            if (err) {
                console.log('Error:' + err);
                callback(db_err_statuscode, db_err_msg);// DB Error. Here error of connecting to db
            }
            console.log("Connected correctly to server.");
            var user_status = {};
            for(var i = 0 ; i < userlist.length;i++){
                (function (i) {
                    var username = userlist[i];
                    let new_user = new User(username, "", "");
                    new_user.getEmergencyStatus(db, function (status, err) {
                        if (err) callback(db_err_statuscode, db_err_msg);
                        else {
                            user_status[username] = status;
                            if(i == userlist.length - 1){
                                console.log("USER STATUS");
                                console.dir(user_status);
                                callback(success_statuscode, user_status)
                            }
                        }
                    });

                })(i);
            }
            db.close();
        })
    };
    GetAllUsernameAndEmergencyStatus(callback){
        MongoClient.connect(url, function(err, db) {
            if (err) {
                console.log('Error:' + err);
                callback(db_err_statuscode, db_err_msg);// DB Error. Here error of connecting to db
            }
            else {
                let new_user = new User("", "", "", "");
                new_user.getAllUsernameAndEmergencyStatus(db, function(results, err){
                    callback(success_statuscode, results);
                })
            }
        })
    };
}

let dboper = new JoinCommunityDBOper();

module.exports = {
  Login: dboper.Login,
  AddDB: dboper.AddDB,
  GetAllUsers: dboper.GetAllUsers,
  Logout: dboper.Logout,
    GetUserEmergencyStatus: dboper.GetUserEmergencyStatus,
    GetAllUsernameAndEmergencyStatus: dboper.GetAllUsernameAndEmergencyStatus
}
