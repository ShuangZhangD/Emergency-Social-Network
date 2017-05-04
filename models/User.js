/**
 * Created by Ling on 2017/3/18.
 */
"use strict";
class User {

    // Constructor for initializing values for a new user
    constructor(username, password, status, EmergencyStatus, AccountStatus, PrivilegeLevel, firstname, lastname, email, emergencycontact, contactemail) {
        this.username = username;
        this.password = password;
        this.status   = status;
        this.emergencystatus = EmergencyStatus;
        this.accountstatus = AccountStatus;
        this.privilegelevel = PrivilegeLevel;
        this.firstname   = firstname;
        this.lastname   = lastname;
        this.email   = email;
        this.emergencycontact   = emergencycontact;
        this.contactemail   = contactemail;
    }

    // Method to create a new user, takes the "USERS" collection as a parameter
    createUser(db, callback) {
        this.collection = db.collection("USERS");
        this.collection.insert({
            "username"  : this.username,
            "password"  : this.password,
            "status"    : this.status,
            "emergencystatus" : "Undefined",
            "accountstatus" : "Active",
            "privilegelevel" : "Citizen",
            "firstname"  : "",
            "lastname"  : "",
            "email"  : "",
            "emergencycontact"  : this.emergencycontact,
            "contactemail"  : this.contactemail
        }, function(err, results) {
            callback(results, null);
        });
    }

    // Method to delete a user, takes the "USERS" collection as a parameter
    removeUser(db, callback) {
        this.collection = db.collection("USERS");
        this.collection.remove({"username" : this.username}, function(err, results) {
            callback(results, null);
        });
    }

    // Updates the status of a user
    updateStatus(db, username, status, callback) {
        this.collection = db.collection("USERS");
        this.collection.update({"username" : username}, {$set : { "status" :  status}}, function(err, results) {
            callback(results, null);
        });
    }

    // Retrieves the users based on the status passed
    displayStatusUsers(db, status, callback) {
        this.collection = db.collection("USERS");
        //this.collection.find({"status" : status}, function(err, results) {
        this.collection.find({"status": status}, {username:1}).toArray(function(err, results) {
            callback(results, null);
        });
    }

    // Method to check if a user exists
    checkUser(db, username, callback) {
        this.collection = db.collection("USERS");
        this.collection.find({"username" : username}).toArray(function(err, result) {
            callback(result, null);
        });
    }

    // Method to authenticate the user
    checkPassword(db, username, password, callback) {
        this.collection = db.collection("USERS");
        this.collection.find({"username" : username, "password" : password}).toArray(function(err, result) {
            callback(result, null);
        });
    }
    getAllUsernameAndEmergencyStatus(db, callback){
        this.collection = db.collection("USERS");
        this.collection.find().toArray(function(err, results) {
            var userstatuslist = {};
            results.forEach(function (result) {
                userstatuslist[result.username] = result.emergencystatus;
            });
            callback(userstatuslist, null);
        });
    }

    getAllUsernameAndAccountstatus(db, callback){
        this.collection = db.collection("USERS");
        this.collection.find().toArray(function(err, results) {
            var userstatuslist = {};
            results.forEach(function (result) {
                //console.log("getting username "+result.username+" account status "+result.accountstatus);
                userstatuslist[result.username] = result.accountstatus;
            });
            callback(userstatuslist, null);
        });
    }

}

module.exports = User;
