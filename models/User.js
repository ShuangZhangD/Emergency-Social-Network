/**
 * Created by Ling on 2017/3/18.
 */
'use strict';
class User {

    // Constructor for initializing values for a new user
    constructor(username, password, status, EmergencyStatus) {
        this.username = username;
        this.password = password;
        this.status   = status;
        this.emergencystatus = EmergencyStatus;
       // this.updatetimestamp =
        console.log("No error load user")
    }

    // Method to create a new user, takes the "USERS" collection as a parameter
    createUser(db, callback) {
        this.collection = db.collection('USERS');
        this.collection.insert({
            "username"  : this.username,
            "password"  : this.password,
            "status"    : this.status,
            "emergencystatus" : "Undefined"
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
        //should be "EmergencyStatus":
        this.collection.find({"username": this.username}, {"emergencystatus":1}).toArray(function(err, results) {
            if(err)
            {
                console.log('Error updating the status ' + err);
                callback(null, err);
            }
            else {
                //console.log("printing results.emergencystatus in user.js");
				//console.log(results.emergencystatus);
				if(!results.emergencystatus) {
					// Invoked when the user has not set the status yet
					results.emergencystatus="Undefined";
				}
				//console.log("printing results.emergencystatus again in user.js");
                //console.log(results.emergencystatus);
                callback(String(results.emergencystatus), null);
            }
        });
    }

    // // Update the user's emergency status based on the username
    // updateEmergencyStatus(db, username, emergencystatus, callback) {
    //     this.collection = db.collection('USERS');
    //     //this.collection.find({"status" : status}, function(err, results) {
    //     this.collection.update({"username": this.username}, {$set :{"emergencystatus":emergencystatus}}, function(err, results) {
    //         if(err)
    //         {
    //             console.log('Error updating the status ' + err);
    //             callback(null, err);
    //         }
    //         else {
    //             console.log(results.EmergencyStatus);
    //             callback(String(results.EmergencyStatus), null);
    //         }
    //     });
    // }

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
    getAllUsernameAndEmergencyStatus(db, callback){
        this.collection = db.collection('USERS');
        this.collection.find({}, {username:1, emergencystatus:1}).toArray(function(err, results) {
            if(err)
            {
                console.log('Error in authenticating user'+ err);
                callback(null, err);
            }
            else {
                var userstatuslist = {};
                results.forEach(function (result) {
                    //console.log("USERNAME IN DB: "+result.username);
                    //console.log("EMERGENCY IN DB: "+result.emergencystatus);
                    userstatuslist[result.username] = result.emergencystatus;
                });
                callback(userstatuslist, null);
            }
        });
    }
}

module.exports = User;
