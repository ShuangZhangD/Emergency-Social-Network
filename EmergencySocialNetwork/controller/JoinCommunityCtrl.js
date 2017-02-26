var express = require('express');
var myParser = require("body-parser");
var dboper = require("./dboperation.js");
var app = express();
var md5 = require('md5');

var Validate = function(username, password){
  if( /\w{3,}/.test(username) && /\w{4,}/.test(password) )
    return true
  else 
    return false
}

var SortUserList = function(userlist)
//userlist should be an array of users
{
    return userlist.sort();
}

module.exports = {
  LoginCommunity: function (req, res) {
	var info = req.body
	var username = info["username"]
	var password = info["password"]
  var encry_password = md5(password)

  //validate the username and password
  if(!Validate(username, password)) {
      //res.status(403).send(''); //username or password invalid
      res.status(403).json({success:0, errortype:["username or password invalid"]}); //username or password invalid
  }
  else {
    dboper.Login(username, encry_password, function(statuscode, content){
      if(statuscode != 200){
        res.status(statuscode).json({"success":0, "errortype":[content]});
      }
      else{
        sorted_content = SortUserList(content)
        co
      }
    })
  }
},

  AddUser: function (req,res){
  var info = req.body
  var username = info["username"]
  var password = info["password"]
  var encry_password = md5(password)

  //validate username and password
  if(!Validate(username, password)) {
    res.status(403).json({success:0, errortype:["username or password invalid"]}); //username or password invalid
  }
  else {
    //add info into database
    dboper.AddDB(username, encry_password, function(statuscode, content){
      if(statuscode != 200){
        res.status(statuscode).json({"success":0, "errortype":[content]});
      }
      else{
        sorted_content = SortUserList(content)
        res.status(statuscode).json({"success":1, "data":[sorted_content]});
      }
    })
  }
  },

  ListUser: function(req, res){
    dboperator.GetAllUsers(function(statuscode, content){
      if(statuscode != 200){
        res.status(statuscode).json({"success":0, "errortype":[content]});
      }
      else{
        sorted_content = SortUserList(content)
        res.status(statuscode).json({"success":1, "data":[sorted_content]});
      }
    })
  }
}