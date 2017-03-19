/**
 * Created by keqinli on 3/18/17.
 */

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var express = require('express');
var User = require('./DatabaseMethods.js');
var url = 'mongodb://localhost:27017/test2';

var db_err_msg = "Database Error";

class ShareStatusDBoper{
    //update user table and message talbe in db

    Updatesharestatus(username, status, callback){
        //connect to database
        MongoClient.connect(url, function (err, db) {
            if (err) {
                console.log('Error:'+ err);
                callback(400, db_err_msg);// DB Error. Here error of connecting to db
            }
            else {
                console.log("Connected correctly to server.");
                var usercollection = db.collection("user");
                //To do here, invoke dbmethods to update user status
            }
        });
    }
}

let ssdboper = new ShareStatusDBoper();

module.exports = {
    Updatesharestatus : ssdboper.Updatesharestatus
}