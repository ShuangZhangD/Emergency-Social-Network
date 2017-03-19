/**
 * Created by Ling on 2017/3/18.
 */
'use strict';
class User {

    // Constructor for initializing values for a new user
    constructor(username, password, status) {
        this.username = username;
        this.password = password;
        this.status   = status;
        console.log("No error load user")
    }

    // Method to create a new user, takes the "USERS" collection as a parameter
    createUser(db, callback) {
        this.collection = db.collection('USERS');
        this.collection.insert({
            "username"  : this.username,
            "password"  : this.password,
            "status"    : this.status,
            "EmergencyStatus" : "Undefined"
        }, function(err, results) {
            if(err)
            {
                console.dir('Error creating a new user'+ err);
                callback(null, err);
            }
            else callback(results, null);
        });
    }

    // Retrieves the users based on the status passed
    getEmergencyStatus(db, callback) {
        this.collection = db.collection('USERS');
        //this.collection.find({"status" : status}, function(err, results) {
        this.collection.find({"username": this.username}, {"EmergencyStatus":1}).toArray(function(err, results) {
            if(err)
            {
                console.log('Error updating the status ' + err);
                callback(null, err);
            }
            else {
                console.log(results.EmergencyStatus);
                callback(String(results.EmergencyStatus), null);
            }
        });
    }

    // Method to display a user, takes the "USERS" collection as a parameter
    displayUser(db, callback) {
        this.collection = db.collection('USERS');
        this.collection.find({"username" : this.username}).toArray(function(err, results) {
            if(err)
            {
                console.dir('Error in displaying the user'+ err);
                callback(null, err);
            }
            else {
                console.dir(results);
                callback(results, null);
            }
        });
    }

    // Method to delete a user, takes the "USERS" collection as a parameter
    removeUser(db, callback) {
        this.collection = db.collection('USERS');
        this.collection.remove({"username" : this.username}, function(err, results) {
            if(err)
            {
                console.dir('Error creating a new user'+ err);
                callback(null, err);
            }
            else {
                console.dir(results);
                callback(results, null);
            }
        });
    }

    // Updates the status of a user
    updateStatus(db, username, status, callback) {
        this.collection = db.collection('USERS');
        this.collection.update({"username" : username}, {$set : { "status" :  status}}, function(err, results) {
            if(err)
            {
                console.dir('Error updating the status ' + err);
                callback(null, err);
            }
            else {
                console.dir(results);
                callback(results, null);
            }
        });
    }

    // Retrieves the users based on the status passed
    displayStatusUsers(db, status, callback) {
        this.collection = db.collection('USERS');
        //this.collection.find({"status" : status}, function(err, results) {
        this.collection.find({"status": status}, {username:1}).toArray(function(err, results) {
            if(err)
            {
                console.dir('Error updating the status ' + err);
                callback(null, err);
            }
            else {
                console.dir(results);
                callback(results, null);
            }
        });
    }

    // Retrieves all the users
    displayUsers(db, callback) {
        this.collection = db.collection('USERS');
        //this.collection.find().toArray(function(err, results) {
        this.collection.find({}, {username:1}).toArray(function(err, results) {
            if(err)
            {
                console.dir('Error updating the status ' + err);
                callback(null, err);
            }
            else {
                console.dir(results);
                callback(results, null);
            }
        });
    }

    // Method to check if a user exists
    checkUser(db, username, callback) {
        this.collection = db.collection('USERS');
        this.collection.find({"username" : username}).toArray(function(err, result) {
            if(err)
            {
                console.log('Error in retrieving user'+ err);
                callback(null, err);
            }
            else {
                console.dir(result);
                callback(result, null);
            }
        });
    }

    // Method to authenticate the user
    checkPassword(db, username, password, callback) {
        this.collection = db.collection('USERS');
        this.collection.find({"username" : username, "password" : password}).toArray(function(err, result) {
            if(err)
            {
                console.log('Error in authenticating user'+ err);
                callback(null, err);
            }
            else {
                console.dir(result);
                callback(result, null);
            }
        });
    }
}

module.exports = User;
