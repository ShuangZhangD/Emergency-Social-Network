/**
 * Created by Jilei Wang on April 17, 2017.
 * Applied Test Driven Development
 */
"use strict";

var MongoClient = require("mongodb").MongoClient;

var default_ESNAdmin = {
    "username": "ESNAdmin",
    "password": "21232f297a57a5a743894a0e4a801fc3",
    "status": "offline",
    "emergencystatus": "OK",
    "accountstatus": "Active",
    "privilegelevel": "Administrator"
};

class ESNAdmin {

    constructor() {

    }

    init(url, callback) {
        MongoClient.connect(url, function(err, db) {
            var collection = db.collection("USERS");
            collection.find({"privilegelevel": "Administrator"}).toArray(function (err, results) {
                if (results.length == 0) {
                    // if no admin exists
                    collection.find({"username": "ESNAdmin"}).toArray(function (err, results) {
                        if (results.length == 0) {
                                    // no ESNAdmin, insert.
                                    collection.insert(default_ESNAdmin, function (err, results) {
                                        callback("Insert ESNAdmin.");
                                        db.close();
                                    });
                                }
                                else {
                                    // ESNAdmin exists but not admin, update.
                                    collection.update({"username" : "ESNAdmin"}, {$set : {"privilegelevel": "Administrator"}}, function (err, results) {
                                        callback("Update ESNAdmin.");
                                        db.close();
                                    });
                                }
                           // }
                        });
                    }
                    else {
                        // some admin exists, do nothing
                        callback("Some admin exists.");
                        db.close();
                    }
                //}
            });
        });
    }
}

let esnAdmin = new ESNAdmin();
module.exports = esnAdmin;
