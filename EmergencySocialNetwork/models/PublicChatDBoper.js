/**
 * Created by shuang on 2/26/17.
 */
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var express = require('express');
var url = 'mongodb://localhost:27017/test';


exports.InsertMessage = function(sender, receiver, message, type, postTime, callback) {
    //connect to database
    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log('Error:'+ err);
            callback(400, db_err_msg);// DB Error. Here error of connecting to db
        }
        console.log("Connected correctly to server.");
        var collection = db.collection('messages');
        //insert into table
        var data = [{"sender":sender,"receiver":receiver, "message": message, "type": type, "postTime": postTime}];
        collection.insert(data, function(err, result) {
            if(err)
            {
                console.log('Error:'+ err);
                callback(null, err);
            }
            else callback(result, null);
        });
        db.close();
    });
}

exports.LoadPublicMessage = function(callback) {
    MongoClient.connect(url, function(err, db) {
        if (err) {
            console.log('Error:' + err);
            callback(400, db_err_msg);// DB Error. Here error of connecting to db
        }
        console.log("Connected correctly to server.");
        var collection = db.collection('messages');
        collection.find({"type": "public"}, callback);
    });
}