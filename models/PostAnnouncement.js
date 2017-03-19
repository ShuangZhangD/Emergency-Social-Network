/**
 * Created by shuang on 3/18/17.
 */
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var express = require('express');
var url = 'mongodb://root:1234@ds135700.mlab.com:35700/esnsv7';

var db_err_msg = "Database Error";

exports.InsertAnouncement = function(sender, announcement, postTime, callback) {
    //connect to database
    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log('Error:'+ err);
            callback(400, db_err_msg);// DB Error. Here error of connecting to db
        }
        console.log("Connected correctly to server.");
        var collection = db.collection('amouncement');
        //insert into table
        var data = [{"sender": sender,"announcement":announcement, "postTime": postTime}];
        collection.insert(data, callback);
        db.close();
    });
};

exports.LoadAnnouncement = function(callback) {
    MongoClient.connect(url, function(err, db) {
        if (err) {
            console.log('Error:' + err);
            callback(400, db_err_msg);// DB Error. Here error of connecting to db
        }
        console.log("Connected correctly to server.");
        var collection = db.collection('messages');
        collection.find({"type": "public"}).toArray(function(err, results){
            if(err)
            {
                console.log('Error:'+ err);
                callback(err, "Database error");
            }else {
                var datas = [];
                results.forEach(function(result){
                    var data = {};
                    data["username"] = result.sender;
                    data["announcement"] = result.announcement;
                    data["timestamp"] = result.postTime;
                    console.log(result);
                    datas.push(data);
                });
                //var jsonString = JSON.stringify(datas);
                callback(err,datas);
            }
        });
        db.close();
    });
};