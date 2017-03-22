/**
 * Created by keqinli on 3/18/17.
 */
'use strict';
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var express = require('express');
var DBConfig = require('./DBConfig');
let dbconfig = new DBConfig();
var url = dbconfig.getURL();
//var User = require('./DatabaseMethods.js');
// var url = 'mongodb://localhost:27017/test2';
//var url = 'mongodb://root:1234@ds137730.mlab.com:37730/esnsv7';

var User =require('./User.js');

var db_err_msg = "Database Error";

class ShareStatusDBoper{
    //update user table and message talbe in db

    Updatesharestatus(username, emergencystatus, callback){
        //connect to database
       console.log(" ================= inside updatesharestatus in dboper.js");
   MongoClient.connect(url, function (err, db) {
            if (err) {
                console.log('Error:'+ err);
                callback(400, db_err_msg);// DB Error. Here error of connecting to db
            }
            else {
                console.log("Connected correctly to server.");
                console.log("Calling update in db");
    var usercollection = db.collection("USERS");
    console.log(username);
    console.log(emergencystatus);
                usercollection.update({"username": username}, {$set :{"emergencystatus":emergencystatus}},callback);
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
                var usercollection = db.collection("USERS");
              //  usercollection.update({"username": username}, {$set :{"EmergencyStatus":emergencystatus}},callback);
                //To do here, invoke dbmethods to get particular user's status
                var data={};
              //  console.log("=============" + username);
                usercollection.find({"username": username}).toArray(function(err, results){
                //usercollection.find({"username": "keqin"}).toArray(function(err, results){
                    if(err)
                        console.log('Error updating the status ' + err);
                    else {
                        if(results.length===0) {
                            results.emergencystatus = "Undefined1234";
                            console.log("get  status: here:" + String(results.emergencystatus));
                        }
                        else {
                            results.forEach(function(result){
                            console.log("get share status: here:"+ result.emergencystatus);
                                data["emergencystatus"] = result.emergencystatus;
                        });
                        }
                        callback(err, data);

                    }

                });

    //console.log("get share status: here:"+ emergencystatus.emergencystatus);
                //callback(err, emergencystatus);
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
