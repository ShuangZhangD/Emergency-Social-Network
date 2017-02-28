'use strict';
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var express = require('express');
var User = require('./DatabaseMethods.js');
var url = 'mongodb://localhost:27017/test';

/*var CheckUsername = function(db, username, callback) {
  var collection = db.collection('users');
  var whereStr = {"username":username};
  collection.find(whereStr).toArray(function(err, result) {
    if(err)
    {
      console.log('Error:'+ err);
      callback(null, err);
    }     
    else callback(result, null);
  });
}

var CheckPwd = function(db, username, password, callback) {  
  var collection = db.collection('users');
  var whereStr = {"username":username, "password":password};
  collection.find(whereStr).toArray(function(err, result) {
    if(err)
    {
      console.log('Error:'+ err);
      callback(null, err);
    }     
    else callback(result, null);
  });
}

var InsertUser = function(db, username, password, callback) {  
    //connect to database
    var collection = db.collection('users');
    //insert into table
    var data = [{"username":username,"password":password, "status":"online"}];
    collection.insert(data, function(err, result) { 
        if(err)
        {
            console.log('Error:'+ err);
            callback(null, err);
        }     
        else callback(result, null);
    });
}

var GetAllUsername = function(db, callback) {
    var collection = db.collection('users');
    collection.find({}, {username:1}).toArray(function(err, results) {
        if(err)
        {
            console.log('Error:'+ err);
            callback(null, err);
        }
        else {
            var userlist = [];
            results.forEach(function(result){
                console.log(result)
                userlist.push(result.username);
            });
            callback(userlist, null);
        }
    });
}

var GetUserByStatus = function(db, status, callback) {
    var collection = db.collection('users');
    collection.find({"status": status}, {username:1}).toArray(function(err, results) {

        if(err)
        {
            console.log('Error:'+ err);
            callback(null, err);
        }
        else {
            var userlist = [];
            results.forEach(function(result){
                userlist.push(result.username);
            });
            callback(userlist, null);
        }
    });
}

var ChangeStatus = function(db, username, status, callback) {
    var collection = db.collection('users');
    var whereStr = {"username": username};
    var updateStr = {$set: { "status" : status }};
    collection.update(whereStr,updateStr, function(err, result) {
        if(err)
        {
            console.log('Error:'+ err);
            callback(null, err)
        }
        callback(result, null);
    });
}*/

var db_err_msg = "Database Error";
var db_err_statuscode = 400;
var user_not_exist_statuscode = 401;
var user_not_exist_msg = "Username not Exist";
var pwd_incorrect_statuscode = 402;
var pwd_incorrect_msg = "Password Incorrect";
var success_statuscode = 200;


exports.Login = function(username, password, callback){
    MongoClient.connect(url, function(err, db) {
    if(err) {
        console.log('Error:'+ err);
        callback(db_err_statuscode, db_err_msg)
    }// DB Error. Here error of connecting to db
  	else {
        console.log("Connected correctly to server.");
        //create a user
        //var collection = db.collection('USERS');
        //check if the user exist
        let new_user = new User(username, password, "online");
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
                new_user.CheckPassword(db, username, password, function(pwdres, err){
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
/*
        CheckUsername(db, username, function (result, err) {
            //querying error
            if (err) {
                callback(400, db_err_msg);//DB Error. Here query username error
            }

            //if username no exist
            if (result.length == 0) {
                console.log("no found");
                callback(401, "Username not Exist");//User not exist Error, to confirm registering
            }

            //if username exist
            else {
                console.log("found");
                //check if password correct
                console.log(result);
                CheckPwd(db, username, password, function (pwdres, err) {
                    if (err) callback(400, db_err_msg);//DB error
                    if (pwdres.length == 0) {
                        //password incorrect
                        callback(402, "Password Incorrect");//Password Incorrect Error
                    }
                    else {
                        //password correct
                        ChangeStatus(db, username, "online", function (result, err) {
                            if (err) callback(400, db_err_msg);// DB Error.
                        });
                        GetUserByStatus(db, "online", function (userlist, err) {
                            if (err) {
                                callback(400, db_err_msg);// DB Error.
                            }
                            else callback(200, userlist);//Login successfully response
                        });
                    }
                    db.close();
                })
            }

        });//end of check user exist
*/
    }
    });//end of database operation
};

exports.AddDB = function(username, password, callback) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log('Error:'+ err);
            callback(db_err_statuscode, db_err_msg);// DB Error. Here error of connecting to db
        }
        console.log("Connected correctly to server.");
        let new_user = new user_class.User(username, password, "online");
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

        //insert information into database
/*
        InsertUser(db, username, password, function (result, err) {
            if (err) {
                callback(400, db_err_msg);// DB Error. Here error of inserting operation
            }
            else {
                GetUserByStatus(db, "online", function (userlist, err) {
                    if (err) {
                        callback(400, db_err_msg);// DB Error.
                    }
                    else callback(200, userlist);
                });
            }
            db.close();
        });
*/

    });//end of database operation
};

exports.GetAllUsers = function(callback){
    MongoClient.connect(url, function(err, db) {
        if(err){
            console.log('Error:'+ err);
            callback(400, db_err_msg);// DB Error. Here error of connecting to db
        }
        console.log("Connected correctly to server.");
        //insert information into database
        GetAllUsername(db, function(result, err) {
            if(err){
                callback(400, db_err_msg);// DB Error. Here error of inserting operation
            }
            else callback(200, result);
            db.close();
        });
    });//end of database operation
}

exports.Logout = function(username, callback){
    MongoClient.connect(url, function(err, db) {
        if(err){
            console.log('Error:'+ err);
            callback(400, db_err_msg);// DB Error. Here error of connecting to db
        }
        console.log("Connected correctly to server.");
        //insert information into database
        ChangeStatus(db, username, "offline", function(result, err) {
            if(err){
                callback(400, db_err_msg);// DB Error. Here error of inserting operation
            }
            else callback(200, result);
        });
        db.close();
    });//end of database operation
};
