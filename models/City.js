/**
 * Created by Jilei Wang on April 17, 2017.
 */
"use strict";

//var DBConfig = require("../controller/DBConfig");
//let dbconfig = new DBConfig();
var MongoClient = require("mongodb").MongoClient;

class City {

    constructor(json) {
        if (json == null) {
            this.name = "";
            this.location = "";
            this.shelter = [];
            this.json = "";
        }
        else {
            this.name = json.name;
            this.location = json.location;
            this.shelter = json.shelter;
            this.json = json;
        }
    }

    compareTo(city2) {
        if (this.name != city2.name) {
            return false;
        }
        if (this.shelter.length != city2.shelter.length) {
            return false;
        }
        return true;
    }

    initDB(url, callback) {
        var city = this;
        MongoClient.connect(url, function(err, db) {

            var collection = db.collection("city");
            collection.find({"name": city.name}).toArray(function(err, results){

                if (results.length === 0) {
                    collection.insert(city.json, function(err, results) {
                        console.log(results);
                        console.log("insert" + city);
                        callback("insert new city");
                        db.close();
                    });
                }
                else {
                    let city2 = new City(results[0]);
                    if (!city.compareTo(city2)) {
                        collection.update({"name" : city.name}, {$set : { "location" :  city.location, "shelter": city.shelter}}, function(err, results) {
                            console.log(results);
                            console.log("update" + city);
                            callback("update a city");
                            db.close();
                        });
                    }
                    else {
                        callback("do nothing");
                        db.close();
                    }
                }

            });

        });
    }

    search(url, keywordList, callback) {
        var city = this;
        console.log(city);
        MongoClient.connect(url, function (err, db) {

            var collection = db.collection("city");
            var query_city = keywordList[0];
            for (var i = 1; i < keywordList.length; i++) {
                query_city += " " + keywordList[i];
            }
            collection.find({"name": query_city}).toArray(function (err, results) {

                if (results.length > 0) {
                    var result_city = results[0];
                    if (result_city.shelter.length == 0) {
                        // search nearby cities
                        findNearbyCities(collection, result_city, callback, db);
                    }
                    else {
                        callback(1, null, [result_city]);
                        db.close();
                    }
                }
                else {
                    // keywords match, find possible
                    keywordSearch(collection, keywordList, callback, db);
                }

            });

        });
    }

}

var findNearbyCities = function (collection, result_city, callback, db) {
    collection.ensureIndex( { "location": "2d"} );
    collection.find( {"location": { $near:  result_city.location} } ).toArray(function(err, results){
        if(err) {
            console.log("Find city_query Error: " + err);
            callback(0, err, "Find nearby city Error");
        }
        else {
            callback(1, null, results);
        }
        db.close();
    });
};

var keywordSearch = function(collection, keywordList, callback, db) {
    var searchTerm = keywordList[0];
    for (var i = 1; i < keywordList.length; i++) {
        searchTerm = searchTerm + "|" + keywordList[i];
    }
    var regExWord = new RegExp(".*" + searchTerm + ".*");
    collection.find({"name":  regExWord}).toArray(function(err, results) {
        if(err) {
            console.log("keywordSearch Error: " + err);
            callback(0, err, "keywordSearch Error");
        }
        else {
            callback(1, null, results);
        }
        db.close();
    });
};

module.exports = City;
