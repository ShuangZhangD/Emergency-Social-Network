/**
 * Created by keqinli on 3/18/17.
 */
"use strict";
var MongoClient = require("mongodb").MongoClient;
var PrivateChatDBOper = require("./PrivateChatDBOper.js");
var User = require("./User.js");
var db_err_msg = "Database Error";
var db_err_statuscode = 400;
var success_statuscode = 200;

//var url = "mongodb://localhost:27017/test";
//var url = "mongodb://root:1234@ds137730.mlab.com:37730/esnsv7";

class ShareStatusDBoper{
    //update user table and message table in db

    Updatesharestatus(username, emergencystatus, url, callback){
        //connect to database
        MongoClient.connect(url, function (err, db) {
            //console.log("Connected to "+url+" Successfully");
            if (err) {
                //console.log("Error:"+ err);
                callback(400, db_err_msg);// DB Error. Here error of connecting to db
            }
            else {
                var usercollection = db.collection("USERS");
                usercollection.update({"username": username}, {$set :{"emergencystatus":emergencystatus}},callback);

                db.close();
            }
        });
    }

    Getsharestatus(username, url, callback){
        MongoClient.connect(url, function(err, db){

            if (err) {
                //console.log("Error:"+ err);
                callback(400, db_err_msg);// DB Error. Here error of connecting to db
            }
            else {

                var usercollection = db.collection("USERS");
              //  usercollection.update({"username": username}, {$set :{"EmergencyStatus":emergencystatus}},callback);

                var data={};

                usercollection.find({"username": username}).toArray(function(err, results){
                    if(err) {
                        //console.log("Error updating the status " + err);
                    }
                    else {
                        if(results.length===0) {
                            results.emergencystatus = "Undefined";
                        }
                        else {
                            results.forEach(function(result){
                                data["emergencystatus"] = result.emergencystatus;
                            });
                        }
                        callback(err, data);
                    }
                });
            }
            db.close();
        });
    }

    GetEmailForUser(username, url, transporter, callback) {
      var data = "";
      MongoClient.connect(url, function(err, db){

          if (err) {
              //console.log("Error:"+ err);
              callback(400, db_err_msg);// DB Error. Here error of connecting to db
          }
          else {

              var usercollection = db.collection("USERS");
            //  usercollection.update({"username": username}, {$set :{"EmergencyStatus":emergencystatus}},callback);


              usercollection.find({"username": username}).toArray(function(err, results){
                  if(err) {
                      //console.log("Error updating the status " + err);
                  }
                  else {

                      // if(results.length===0 || results[0].contactemail === "") {
                      //     console.log("No contactemail found, not sending a mail");
                      // }
                      //else {
                      var tosend;
                      var changeduser;
                      var emstatus;
                      console.log("printing below");
                      console.log(results[0]);
                      console.log(results[0].contactemail);
                      if(results[0] == undefined || results[0].contactemail == "") {
                          tosend="emergencyservicenetworkfse@gmail.com";
                          changeduser = "test123";
                          emstatus = "OK";

                      }
                      else {
                            tosend = results[0].contactemail;
                            changeduser = results[0].username;
                            emstatus = results[0].emergencystatus;
                      }
                          let mailOptions = {
                              from: '"Emergency Service Network" <emergencyservicenetworkfse@gmail.com>', // sender address
                              to: tosend, // list of receivers
                              subject: "Status Update", // Subject line
                              text: "Your contact has updated their emergency information. " + changeduser + " updated the emergency status to " + emstatus + "."// plain text body
                          };

                          // send mail with defined transport object
                          transporter.sendMail(mailOptions, (error, info) => {});
                      //}
                      callback(err, data);
                  }
              });
          }
          db.close();
      });
    }

    SendPrivateChat (username, url, callback) {
      var temp="";
      MongoClient.connect(url, function(err, db){
          if (err) {
              //console.log("Error:"+ err);
              callback(400, db_err_msg);// DB Error. Here error of connecting to db
          }
          else {
              var usercollection = db.collection("USERS");
            //  usercollection.update({"username": username}, {$set :{"EmergencyStatus":emergencystatus}},callback);

              var data={};
              usercollection.find({"username": username}).toArray(function(err, results){
                  var time = new Date();
                  data = {
                      "sender" : "EmergencyAdmin",
                      "receiver" : results[0].emergencycontact,
                      "PrivateMsg" : "Your contact " + results[0].username + " has updated the emergency status to " + results[0].emergencystatus + ".",
                      "timestamp" : time
                  };

                                      let newpcdboper = new PrivateChatDBOper("EmergencyAdmin", results[0].emergencycontact, url);
                                      newpcdboper.InsertMessage(data, function(statuscode, content){
                                          // if(statuscode == success_statuscode){
                                          //     //res.json({success:1, suc_msg: "Success"});
                                          //     console.log("Message inserted");
                                          // }
                                          // else{
                                          //     //res.json({success:0, err_type: 1, err_msg:content});
                                          //     console.log("error in adding message");
                                          // }
                                      });
                                      callback(err, data);
                      //}
              });
          }
          db.close();
      });
    }
}

let ssdboper = new ShareStatusDBoper();

module.exports = {
    Updatesharestatus : ssdboper.Updatesharestatus,
    Getsharestatus : ssdboper.Getsharestatus,
    GetEmailForUser : ssdboper.GetEmailForUser,
    SendPrivateChat : ssdboper.SendPrivateChat
};
