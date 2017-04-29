/**
 * Created by Jilei on 4/28/17.
 * Applied Test Driven Development.
 */

'use strict';

var expect = require('expect.js');
var request = require('supertest');

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var express = require('express');

var app = express();

var esnAdmin = require("../../models/ESNAdmin");


var DBConfig = require("../TestDBConfig");
let dbconfig = new DBConfig();
var url = dbconfig.getURL();
dbconfig.setURL(url);
var error_url = "mongodb://root:123@ds137730.mlab.com:37730/esns";

//using server not app to listening port 5000
var server = request.agent("https://quiet-peak-31270.herokuapp.com");
// var server = request.agent("http://localhost:5000");

var test_ESNAdmin = {
    "username": "ESNAdmin",
    "password": "21232f297a57a5a743894a0e4a801fc3",
    "status": "online",
    "emergencystatus": "OK",
    "accountstatus": "Active",
    "privilegelevel": "Administrator"
};

var test_other_admin = {
    "username": "other_admin",
    "password": "21232f297a57a5a743894a0e4a801fc3",
    "status": "online",
    "emergencystatus": "OK",
    "accountstatus": "Active",
    "privilegelevel": "Administrator"
};

var test_ESNAdmin_citizen = {
    "username": "ESNAdmin",
    "password": "21232f297a57a5a743894a0e4a801fc3",
    "status": "online",
    "emergencystatus": "OK",
    "accountstatus": "Active",
    "privilegelevel": "Citizen"
};


suite('Profile Management Unit Tests', function(){
    this.timeout(15000);
    
    test("DB Config", function(done){
        dbconfig.setURL(url);
        expect(dbconfig.getURL()).to.equal(url);
        done();
    });

    test("Test init admin when no admin or ESNAdmin exists", function(done) {
        MongoClient.connect(dbconfig.getURL(), function(err, db) {
            expect(err).to.equal(null);
            var collection = db.collection("USERS");
            collection.remove({}, function (err, results) {
                expect(err).to.equal(null);
                esnAdmin.init(dbconfig.getURL(), function (args) {
                    collection.find({"username": "ESNAdmin"}).toArray(function (err, results) {
                        expect(err).to.equal(null);
                        expect(results[0].password).to.equal(test_ESNAdmin.password);
                        expect(results[0].privilegelevel).to.equal(test_ESNAdmin.privilegelevel);
                        done();
                    });
                });
            });
        });
    });

    test("Test init admin when ESNAdmin exists but no admin exists", function(done) {
        MongoClient.connect(dbconfig.getURL(), function(err, db) {
            expect(err).to.equal(null);
            var collection = db.collection("USERS");
            collection.remove({}, function (err, results) {
                collection.insert(test_ESNAdmin_citizen, function (err, results) {
                    expect(err).to.equal(null);
                    esnAdmin.init(dbconfig.getURL(), function (args) {
                        collection.find({"username": "ESNAdmin"}).toArray(function (err, results) {
                            expect(err).to.equal(null);
                            expect(results[0].privilegelevel).to.equal(test_ESNAdmin.privilegelevel);
                            done();
                        });
                    });
                });
            });
        });
    });

    test("Test init admin when another admin exists", function(done) {
        MongoClient.connect(dbconfig.getURL(), function(err, db) {
            expect(err).to.equal(null);
            var collection = db.collection("USERS");
            collection.remove({}, function (err, results) {
                collection.insert(test_other_admin, function (err, results) {
                    expect(err).to.equal(null);
                    esnAdmin.init(dbconfig.getURL(), function (args) {
                        collection.find({"username": "ESNAdmin"}).toArray(function (err, results) {
                            expect(err).to.equal(null);
                            expect(results.length).to.equal(0);
                            done();
                        });
                    });
                });
            });
        });
    });

});