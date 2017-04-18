/**
 * Created by Jilei Wang on April 17, 2017.
 */
"use strict";

var DBConfig = require("../controller/DBConfig");
let dbconfig = new DBConfig();
var MongoClient = require("mongodb").MongoClient;

class City {

    constructor(json) {
        if (json == null) {
            // TODO
        }
        else {
            this.name = json.name;
            this.location = json.location;
            this.shelter = json.shelter;
            this.json = json;
            this.collection = null;
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

    initDB() {
        var city = this;
        MongoClient.connect(dbconfig.getURL(), function(err, db) {
            if (err) {
                console.log("Init Data Error:"+ err);
            }
            else {
                var collection = db.collection("city");
                collection.find({"name": city.name}).toArray(function(err, results){
                    if(err) {
                        console.log("checkCityExist Error: " + err);
                    }
                    else {
                        if (results.length === 0) {
                            collection.insert(city.json, function(err, results) {
                                console.log("insert" + city)
                                db.close();
                            });
                        }
                        else {
                            let city2 = new City(results[0]);
                            if (!city.compareTo(city2)) {
                                collection.update({"name" : city.name}, {$set : { "location" :  city.location, "shelter": city.shelter}}, function(err, results) {
                                    console.log("update" + city)
                                    db.close();
                                });
                            }
                            else {
                                db.close();
                            }
                        }
                    }
                });
            }
        });
    }

}

module.exports = City;
