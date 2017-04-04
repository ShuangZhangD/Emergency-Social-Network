/**
 * Created by keqinli on 3/18/17.
 */
"use strict";
var MongoClient = require("mongodb").MongoClient;

//var url = "mongodb://localhost:27017/test";
//var url = "mongodb://root:1234@ds137730.mlab.com:37730/esnsv7";

var db_err_msg = "Database Error";

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
                //To do here, invoke dbmethods to update user status
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
                //To do here, invoke dbmethods to get particular user"s status
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
}

let ssdboper = new ShareStatusDBoper();

module.exports = {
    Updatesharestatus : ssdboper.Updatesharestatus,
    Getsharestatus : ssdboper.Getsharestatus
};
