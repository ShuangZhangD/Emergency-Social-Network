var express = require('express');
var myParser = require("body-parser");
var dboper = require("../models/JoinCommunityDBoper.js");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var md5 = require('md5');

var Validate = function(username, password){
  if( /\w{3,}/.test(username) && /\w{4,}/.test(password) )
    return true;
  else 
    return false;
}

var SortUserList = function(userlist)
//userlist should be an array of users
{
    return userlist.sort();
}

class JoinCommunityController {


Validate (username, password){
  if( /\w{3,}/.test(username) && /\w{4,}/.test(password) )
    return true;
  else 
    return false;
}

SortUserList (userlist)
//userlist should be an array of users
{
    return userlist.sort();
}

   LoginCommunity (req, res) {
	var info = req.body;
	var username = info["username"];
	var password = info["password"];
  var encry_password = md5(password);

  //validate the username and password
  if(!Validate(username, password)) {
      res.json({success:0, err_type:4, err_msg: "username or password invalid"}); //username or password invalid
  }
  else {
    dboper.Login(username, encry_password, function(statuscode, content){
      if(statuscode != 200){
        if(statuscode == 400)
          res.json({success:0, err_type: 1, err_msg:content});
        else if(statuscode == 401)
            res.json({success:0, err_type: 2, err_msg:content});
        else if(statuscode == 402)
            res.json({success:0, err_type: 3, err_msg:content});
      }
      else{
        var sorted_content = SortUserList(content);
          res.json({"success":1, "data":sorted_content});
          io.on('connection', function(socket)
          {
              //broadcast to every users of this user's join
              io.emit('user joincommunity', username);
          });
      }
    })
  }
}

   AddUser (req,res){
  var info = req.body;
  var username = info["username"];
  var password = info["password"];
  var encry_password = md5(password);

  //validate username and password
  if(!Validate(username, password)) {
      res.json({success:0, err_type:4, err_msg: "username or password invalid"}); //username or password invalid
  }
  else {
    //add info into database
    dboper.AddDB(username, encry_password, function(statuscode, content){
      if(statuscode != 200){
          if(statuscode == 400)
              res.json({success:0, err_type: 1, err_msg:content});
          else if(statuscode == 401)
              res.json({success:0, err_type: 2, err_msg:content});
          else if(statuscode == 402)
              res.json({success:0, err_type: 3, err_msg:content});
      }
      else{
        sorted_content = SortUserList(content);
          res.json({"success":1, "data":sorted_content});
          io.on('connection', function(socket)
          {
              //broadcast to every users of this user's join
              io.emit('user joincommunity', username);
          });
      }
    })
  }
  }

   ListUser (req, res){
    dboper.GetAllUsers(function(statuscode, content1, content2){
      if(statuscode != 200){
        res.json({success:0, err_type: 1, err_msg:content});
      }
      else{
        var sorted_content = SortUserList(content);
        var sorted_content2 = SortUserList(content2);
        res.json({"success":1, "data1":sorted_content1, "data2":sorted_content2});
      }
    })
  }

  Logout (req, res){
        var info = req.body;
        var username = info["username"];
        dboper.Logout(username, function(statuscode, content){
            if(statuscode != 200){
                res.json({success:0, err_type: 1, err_msg:content});
            }
            else{
                res.json({"success":1, "data": ""});
                io.on('connection', function(socket)
                {
                    //broadcast to every users of this user's join
                    io.emit('user leftcommunity', username);
                });
            }
        })
    }
}

let jcc = new JoinCommunityController();

module.exports = {
  LoginCommunity: jcc.LoginCommunity,
  AddUser: jcc.AddUser,
  ListUser: jcc.ListUser,
  Logout: jcc.Logout 
}