var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var express = require('express');
var app = require('express')();
 var myParser = require("body-parser");
var router = express.Router();
var app = express();
var url = 'mongodb://localhost:27017/test';

var CheckUsername = function(db, username, callback) {  
  var collection = db.collection('users');
  var whereStr = {"username":username};
  collection.find(whereStr).toArray(function(err, result) {
    if(err)
    {
      console.log('Error:'+ err);
      callback(result, err);
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
      callback(result, err);
    }     
    else callback(result, null);
  });
}

var InsertUser = function(db, username, password, callback) {  
    //connect to database
    var collection = db.collection('users');
    //insert into table
    var data = [{"username":username,"password":password}];
    collection.insert(data, function(err, result) { 
        if(err)
        {
            console.log('Error:'+ err);
            callback(result, err);
        }     
        else callback(result, null);
    });
}


exports.Login = function(username, password, callback){
    MongoClient.connect(url, function(err, db) {
    if(err) callback(400, err)// DB Error. Here error of connecting to db
  	console.log("Connected correctly to server.");
  	
  	//check if the user exist
   	CheckUsername(db, username, function(result, err) {
      //querying error
      if(err){
        callback(400, err)//DB Error. Here query username error
      }

   		//if username no exist
   		if(result.length==0){
   			console.log("no found");
        callback(401, "Username not Exist")//User not exist Error, to confirm registering
   		}

   		//if username exist
   		else{
   			console.log("found");
   			//check if password correct
   			console.log(result)
   			CheckPwd(db, username, password, function(pwdres, err){
          if(err) callback(400, err)//DB error
   				if(pwdres.length==0){
   					//password incorrect
            callback(402, "Password Incorrect")//Password Incorrect Error
   				}
   				else{
            //password correct
            callback(200, ["helen", "mike", "abel"])//Login successfully response
   				}
   			})
   		}
      db.close();
    });//end of check user exist
  });//end of database operation
}

exports.AddDB = function(username, password, callback){
  MongoClient.connect(url, function(err, db) {
    if(err){
      callback(400, err)// DB Error. Here error of connecting to db
    }
    console.log("Connected correctly to server.");
    
    //insert information into database
    InsertUser(db, username, password, function(result, err) {
      if(err){
        callback(400, err)// DB Error. Here error of inserting operation
      }
      else callback(200, ["helen", "mike", "abel"]);//login successfully response
    db.close();
  });//end of check user exist
});//end of database operation
}
