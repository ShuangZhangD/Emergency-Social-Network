/**
 * Created by keqinli on 3/18/17.
 */

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var express = require('express');
var User = require('./DatabaseMethods.js');
// var url = 'mongodb://localhost:27017/test2';
var url = 'mongodb://root:1234@ds135700.mlab.com:35700/esnsv7';

var userdbmethod =require('./User.js');

var db_err_msg = "Database Error";

class ShareStatusDBoper{
    //update user table and message talbe in db

    Updatesharestatus(username, emergencystatus, callback){
        //connect to database
        MongoClient.connect(url, function (err, db) {
            if (err) {
                console.log('Error:'+ err);
                callback(400, db_err_msg);// DB Error. Here error of connecting to db
            }
            else {
                console.log("Connected correctly to server.");
                var usercollection = db.collection("user");
                usercollection.update({"username": username}, {$set :{"EmergencyStatus":emergencystatus}},callback);
                    //To do here, invoke dbmethods to update user status
                db.close();
            }
        });
    }

    Getsharestatus(username, callback){
        MongoClient.connect(url, function(err, db){

            if (err) {
                console.log('Error:'+ err);
                callback(400, db_err_msg);// DB Error. Here error of connecting to db
            }
            else {
                console.log("Connected correctly to server.");
                //var usercollection = db.collection("user");
                //usercollection.update({"username": username}, {$set :{"EmergencyStatus":emergencystatus}},callback);
                //To do here, invoke dbmethods to get particular user's status
                var EmergencyStatus={};
                userdbmethod.getEmergencyStatus(db, function(data, err){
                    if(err){
                        console.log('Error:'+ err);
                        callback(400, db_err_msg);// DB Error. Here error of connecting to db
                    }
                    else {
                        EmergencyStatus=data;
                    }
                });
                callback(err, EmergencyStatus);
            }
            db.close();
        });
    }
}

let ssdboper = new ShareStatusDBoper();

module.exports = {
    Updatesharestatus : ssdboper.Updatesharestatus,
    Getsharestatus : ssdboper.Getsharestatus
}