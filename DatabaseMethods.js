'use strict';

// Creating Class user
class User {

    // Constructor for initializing values for a new user
    constructor(username, password, status) {
      this.username = username;
      this.password = password;
      this.status   = status;
    }

    // Method to create a new user, takes the "USERS" collection as a parameter
    createUser(db, callback) {
      this.collection = db.collection('USERS');
      this.collection.insert({
        "username"  : this.username,
        "password"  : this.password,
        "status"    : this.status
      }, function(err, results) {
        if(err)
        {
            console.dir('Error creating a new user'+ err);
            callback(null, err);
        }
        else callback(results, null);
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
      this.collection.find({"status" : status}, function(err, results) {
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
      this.collection.find().toArray(function(err, results) {
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
      this.collection.find({"username" : username}).toArray(function(err, results) {
        if(err)
        {
            console.log('Error in retrieving user'+ err);
            callback(null, err);
          }
          else {
            console.dir(results);
            callback(results, null);
          }
        });
    }

    // Method to authenticate the user
    checkPassword(db, username, password, callback) {
      this.collection = db.collection('USERS');
      this.collection.find({"username" : username, "password" : password}).toArray(function(err, results) {
        if(err)
        {
            console.log('Error in authenticating user'+ err);
            callback(null, err);
          }
          else {
            console.dir(results);
            callback(results, null);
          }
        });
    }
}

// Creating Message Class
class Message {

  // Constructor for initializing values for a new message
  constructor(sender, receiver, type, message, created) {
    this.sender = sender;
    this.receiver = receiver;
    this.type = type;
    this.message = message;
    this.created = created;
  }

  // Method to insert a new message, takes the "MESSAGE" collection as the parameter
  // If the receiverid is null, it indicates a message that was shared publicly
  // The type can have values "Public", "Private" or "GroupName"
  insertMessage(db, callback) {
    this.collection = db.collection('MESSAGES');
    this.collection.insert({
      "sender"    : this.sender,
      "receiver"  : this.receiver,
      "type"     : this.type,
      "message"  : this.message,
      "created"	 : this.created
    }, function(err, results) {
      if(err)
      {
          console.dir('Error inserting the message ' + err);
          callback(null, err);
      }
      else {
        console.dir(results);
        callback(results, null);
      }
    });
  }


  // Method to display all the messages
  displayMessages(db, callback) {
    this.collection = db.collection('MESSAGES');
    this.collection.find().toArray(function(err, results) {
      if(err)
      {
          console.dir('Error inserting the message ' + err);
          callback(null, err);
      }
      else {
        console.dir(results);
        callback(results, null);
      }
    });
  }
}
