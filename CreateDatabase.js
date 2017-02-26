'use strict';

// Creating Class user
class User {
    constructor(id, username, password, status) {
      this.id = id;
      this.username = username;
      this.password = password;
      this.status   = status;
    }

    createUser(collection) {
      this.collection = collection;
      collection.insert({
        "id"        : this.id,
        "username"  : this.username,
        "password"  : this.password,
        "status"    : this.status
      });
    }

    displayUser(collection) {
      this.collection = collection;
      collection.find({"username" : this.username}).toArray(function(err, results) {
        console.dir(results);
      });;
    }

    removeUser(collection) {
      this.collection = collection;
      collection.remove({"username" : this.username});
    }
}

class Message {
  constructor(senderid, receiverid, message) {
    this.senderid = senderid;
    this.receiverid = receiverid;
    this.message = message;
  }

  createMessage(collection) {
    this.collection = collection;
    collection.insert({
      "senderid"  : this.senderid,
      "receiverid"  : this.receiveid,
      "message"  : this.message,
    });
  }

  displayMessage(collection) {
    this.collection = collection;
    collection.find({"message" : this.message}).toArray(function(err, results) {
      console.dir(results);
    });;
  }
}
var MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://127.0.0.1:27017/ESNDB', function (err, db) {
  if (err) {
    throw err;
  }
  else {
var collection = db.collection('USERS');
let test_user = new User("1", "test_username", "test_password", "offline");
test_user.removeUser(collection);
test_user.createUser(collection);
test_user.displayUser(collection);

collection = db.collection('MESSAGES');
let test_message = new Message("1", "2", "Test message created during testing");
test_message.createMessage(collection);
test_message.displayMessage(collection);
db.close();
}
});
