"use strict";
var MongoClient = require("mongodb").MongoClient;

//var url = "mongodb://localhost:27017/test";
//var url = "mongodb://root:1234@ds137730.mlab.com:37730/esnsv7";

var db_err_msg = "Database Error";

class OwnProfileManagementDBoper{

    updateOwnProfileForUser(username, data, url, callback){
        //connect to database
        var firstname = data["firstname"];
        var lastname = data["lastname"];
        var email = data["email"];
        var emergencycontact = data["emergencycontact"];
        var contactemail = data["contactemail"];
        MongoClient.connect(url, function (err, db) {
            //console.log("Connected to "+url+" Successfully");
            if (err) {
                //console.log("Error:"+ err);
                callback(400, db_err_msg);// DB Error. Here error of connecting to db
            }
            else {
                var usercollection = db.collection("USERS");
                usercollection.update({"username": username}, {$set :{"firstname":firstname, "lastname": lastname, "email" : email, "emergencycontact" : emergencycontact, "contactemail" : contactemail}},callback);
                db.close();
            }
        });
    }

    getOwnProfileForUser(username, url, callback){
        MongoClient.connect(url, function(err, db){
            if (err) {
                callback(400, db_err_msg);// DB Error. Here error of connecting to db
            }
            else {
                var usercollection = db.collection("USERS");
                var data={};
                usercollection.find({"username": username}).toArray(function(err, results){
                    results.forEach(function(result){
                        data["username"] = result.username;
                        data["firstname"] = result.firstname;
                        data["lastname"] = result.lastname;
                        data["email"] = result.email;
                        data["emergencycontact"] = result.emergencycontact;
                        data["contactemail"] = result.contactemail;
                    });
                    callback(err, data);
                });
            }
            //db.close();
        });
    }
}

let pmdboper = new OwnProfileManagementDBoper();

module.exports = {
    updateOwnProfileForUser : pmdboper.updateOwnProfileForUser,
    getOwnProfileForUser : pmdboper.getOwnProfileForUser
};
