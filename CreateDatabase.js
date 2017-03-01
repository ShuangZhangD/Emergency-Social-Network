'use strict';

// Creating Class user
class User {

    // Constructor for initializing values for a new user
    constructor(id, username, password, status) {
      this.id = id;
      this.username = username;
      this.password = password;
      this.status   = status;
    }

    // Method to create a new user, takes the "USERS" collection as a parameter
    createUser(collection) {
      this.collection = collection;
      collection.insert({
        "id"        : this.id,
        "username"  : this.username,
        "password"  : this.password,
        "status"    : this.status
      });
    }

    // Method to display a user, takes the "USERS" collection as a parameter
    displayUser(collection, callback) {
      this.collection = collection;
      collection.find({"username" : this.username}).toArray(function(err, results) {
        callback(results);
      });
    }

    CheckPassword(collection, callback) {
        this.collection = collection;
        collection.find({"username" : this.username, "password": this.password}).toArray(function(err, results) {
            callback(results);
        });
    }

    // Method to delete a user, takes the "USERS" collection as a parameter
    removeUser(collection) {
      this.collection = collection;
      collection.remove({"username" : this.username});
    }
}
module.exports = User
// Creating Message Class
class Message {

  // Constructor for initializing values for a new message
  constructor(senderid, receiverid, message, created) {
    this.senderid = senderid;
    this.receiverid = receiverid;
    this.message = message;
    this.created = created;
  }

  // Method to insert a new message, takes the "MESSAGE" collection as the parameter
  // If the receiverid is null, it indicates a message that was shared publicly
  createMessage(collection) {
    this.collection = collection;
    collection.insert({
      "senderid"  : this.senderid,
      "receiverid"  : this.receiveid,
      "message"  : this.message,
      "created"	 : this.created
    });
  }

  // Method to display a message, takes the "MESSAGE" collection as the parameter
  displayMessage(collection) {
    this.collection = collection;
    collection.find({"message" : this.message}).toArray(function(err, results) {
      console.dir(results);
    });;
  }
}

// Database Connection to ESNDB
/*var MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://127.0.0.1:27017/ESNDB', function (err, db) {
  if (err) {
    throw err;
  }
  else {
    // Initializing and creating a new user
    var collection = db.collection('USERS');
    let test_user = new User("1", "test_username", "test_password", "offline");
    test_user.removeUser(collection);
    test_user.createUser(collection);
    test_user.displayUser(collection);

    // Initializing and creating a message
    collection = db.collection('MESSAGES');
    let test_message = new Message("1", "2", "Test message created during testing", "12/01/2017 11:11:11");
    test_message.createMessage(collection);
    test_message.displayMessage(collection);
    db.close();
  }
});*/
