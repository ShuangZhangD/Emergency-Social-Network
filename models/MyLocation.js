/**
 * Created by Jilei Wang on April 17, 2017.
 */
"use strict";

var DBConfig = require("../controller/DBConfig");
let dbconfig = new DBConfig();
var MongoClient = require("mongodb").MongoClient;

class MyLocation {

    constructor(location) {
        this.location = location;
        //this.city = findCity(location);
    }

    findCity(callback) {
        var location = this.location;
        var myLocation = this;
        MongoClient.connect(dbconfig.getURL(), function(err, db) {
            if (err) {
                console.log("findCity Error:"+ err);
                callback(err, "Err 1");
            }
            else {
                var collection = db.collection("city");
                collection.ensureIndex( { "location": "2d"} )
                collection.find( {"location": { $near: location } } ).toArray(function(err, results){
                    if(err) {
                        console.log(location);
                        console.log("findCity Error: " + err);
                        callback(err, "Err 2"); // , $maxDistance: 10 
                    }
                    else {
                        console.log(results);
                        callback(null, results);
                    }
                });
            }
        });
    }
}

module.exports = MyLocation;