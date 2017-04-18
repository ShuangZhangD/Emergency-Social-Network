/**
 * Created by Jilei and Komala on 4/01/17.
 */

'use strict';

var expect = require('expect.js');
var request = require('supertest');

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var express = require('express');

var app = express();


var City = require("../../models/City.js");
var MyLocation = require("../../models/MyLocation.js");


var DBConfig = require("../TestDBConfig");
let dbconfig = new DBConfig();
var url = dbconfig.getURL();
var error_url = "mongodb://root:123@ds137730.mlab.com:37730/esns";

//using server not app to listening port 5000
var server = request.agent("https://quiet-peak-31270.herokuapp.com");
// var server = request.agent("http://localhost:5000");

var mountain_view = {
    "name" : "Mountain View Mock",
    "location" : [37.410406, -122.05967899999999],
    "shelter" : [
        {
            "name": "CMU-SV",
            "location" : [37.410406, -122.05967899999999],
            "address" : "Moffett Field, CA 94035"
        },
        {
            "name": "Nasa Research Park",
            "location" : [37.411406, -122.04977899999999],
            "address" : "Moffett Field, CA 94035"
        },
        {
            "name": "Mountain View Downtown",
            "location" : [37.4008179,-122.0857112],
            "address" : "500 Castro St, CA 94041"
        }
    ]
};

var mountain_view_2 = {
    "name" : "Mountain View Mock",
    "location" : [37.410406, -122.05967899999999],
    "shelter" : []
};

suite('Emergency Shelter Unit Tests', function(){
    this.timeout(15000);

    test("Creat City", function(done){
        // test constructor()
        // create a city
        let city1 = new City(mountain_view);
        expect(city1.name).to.equal(mountain_view.name);
        expect(city1.location).to.equal(mountain_view.location);
        expect(city1.shelter[0].name).to.equal(mountain_view.shelter[0].name);
        // create a empty city
        let city2 = new City(null);
        expect(city2.name).to.equal("");
        expect(city2.location).to.equal("");
        done();
    });

    test("Compare Cities", function(done){
        let city1 = new City(mountain_view);
        let city2 = new City(null);
        let city3 = new City(mountain_view_2);
        let city4 = new City(mountain_view);
        expect(city1.compareTo(city2)).to.equal(false);
        expect(city1.compareTo(city3)).to.equal(false);
        expect(city1.compareTo(city4)).to.equal(true);
        done();
    });

    test("Init DB Non-Exist City", function(done){
        // initDB
        let city1 = new City(mountain_view);
        MongoClient.connect(dbconfig.getURL(), function(err, db) {
            expect(err).to.equal(null);
            var collection = db.collection("city");
            collection.remove({"name": city1.name}, function(err, results){
                expect(err).to.equal(null);
                city1.initDB();
                done();
            });
        });
    });

    test("Init DB Exist Same City", function(done){
        // initDB
        let city1 = new City(mountain_view);
        city1.initDB();
        let city2 = new City(mountain_view);
        city2.initDB();
        expect(city1.compareTo(city2)).to.equal(true);
        done();
    });

    test("Init DB Exist Non-Same City", function(done){
        // initDB
        let city1 = new City(mountain_view);
        city1.initDB();
        let city2 = new City(mountain_view_2);
        city2.initDB();
        expect(city1.compareTo(city2)).to.equal(false);
        done();
    });

    test("Search Exist Non-Empty City", function(done){
        let city = new City(null);
        city.search(["Mountain", "View"], function (success, err_type, result) {
            expect(success).to.equal(1);
            expect(result.length).to.equal(1);
            done();
        });
    });

    test("Search Exist Empty City", function(done){
        let city = new City(null);
        city.search(["San", "Jose"], function (success, err_type, result) {
            expect(success).to.equal(1);
            expect(result.length).to.above(1);
            done();
        });
    });

    test("Search Non-Exist City", function(done){
        let city = new City(null);
        city.search(["Jiaxing", "Pinghu"], function (success, err_type, result) {
            expect(success).to.equal(1);
            expect(result.length).to.equal(0);
            done();
        });
    });

    test("Search Many Cities", function(done){
        let city = new City(null);
        city.search(["San"], function (success, err_type, result) {
            expect(success).to.equal(1);
            expect(result.length).to.above(1);
            done();
        });
    });

    test("Normal Location", function(done){
        let location = new MyLocation([37.410406, -122.05967899999999]);
        location.findCity(function (err, results) {
            expect(result.length).to.above(0);
            done();
        });
    });

    test("Eroor Location", function(done){
        let location = new MyLocation([37.410406, -122.05967899999999]);
        location.location = "1";
        location.findCity(function (err, results) {
            expect(result).to.equal("Err 2");
            done();
        });
    });


/*
    test("Username and EmergencyStatus in Directory", function(done) {
        dboper.Login("testuser", "testpwd", url, function (statuscode1, content1){
            expect(statuscode1).to.equal(200);
            dboper2.Updatesharestatus("testuser", "Help", url, function(statuscode2, content2) {
                dboper.GetAllUsernameAndEmergencyStatus(url, function (statuscode3, content3) {
                    expect(statuscode3).to.equal(200);
                });
            });
            done();
        });
    });

    test("Password Incorrect Login", function(done){
        dboper.Login("testuser", "wrongpwd", url, function (statuscode, content){
            expect(statuscode).to.equal(402);
            done();
        });
    });

    test("Error while Logging In", function(done) {
        dboper.Login("testuser", "testpwd", error_url, function(statuscode, content) {
            expect(statuscode).to.equal(400);
            done();
        });
    });

    test("Error when Creating New User", function(done) {
        dboper.AddDB("testuser", "testpwd", error_url, function (statuscode, content) {
            expect(statuscode).to.equal(400);
            done();
        });
    });

    test("Error when logging out", function(done) {
        dboper.Logout("testuser", error_url, function(statuscode, content) {
            expect(statuscode).to.equal(400);
            done();
        });
    });

    test("DB Error GetAllUsers", function(done) {
        dboper.GetAllUsers(error_url, function(statuscode, content) {
            expect(statuscode).to.equal(400);
            done();
        });
    });

    test("DB Error GetAllUsernameAndEmergencyStatus", function(done) {
        dboper.GetAllUsernameAndEmergencyStatus(error_url, function(statuscode, content) {
            expect(statuscode).to.equal(400);
            done();
        });
    });

    test("DB Error GetAllUsers", function(done) {
        dboper.RemoveUser("",error_url, function(statuscode, content) {
            expect(statuscode).to.equal(400);
            done();
        });
    });
*/
});
