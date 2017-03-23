/**
 * Created by keqinli on 3/20/17.
 */

'use strict';

var expect = require('expect.js');
var request = require('supertest');
var express = require('express');

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var express = require('express');

//var ShareStatusCtrl = require('../controller/ShareStatusCtrl');
var dboper = require("../models/ShareStatusDBoper");
var createoper = require("../models/User.js");

var app = express();


var url = 'mongodb://root:1234@ds135690.mlab.com:35690/esntest';

//using server not app to listening port 5000
var server = request.agent("https://quiet-peak-31270.herokuapp.com");
// var server = request.agent("http://localhost:5000");

suite('Share Status Tests', function(){
    this.timeout(15000);
    var testDB = {};
    //before all tests, init mongodb
    suiteSetup('Init A DB for Test', function(done){
        MongoClient.connect(url, function(err, db) {

            if (err) {
                console("Database erro");
            }
            else {
                testDB = db;
            }
            //done();
        });
        done();

    });

    //after all tests, close mongodb
    suiteTeardown('Close DB for Test', function(done){
        //testDB.collection("MESSAGES").drop();
        //testDB.collection("announcement").drop();
        //testDB.collection("USERS").drop();

        testDB.close();
        done();
    });

    test('Getting Share Status Through RESTful Api', function(done){
        //request(app).get('/announcement').expect("Content-type",/json/)
        server.get('/userstatus/:username')
            .send({"username": "keqin"})
            .expect(200, function(err, res){
                if(err) return done(err);
                else {

                    expect(res.body.success).to.equal(1);

                    done();
                }

            });

    });

    test('Changing Share Status Through RESTful Api', function(done){
        //request(app).get('/announcement').expect("Content-type",/json/)
        server.post('/userstatus')
            .send({"username": "keqin", "emergencystatus": "OK"})
            .expect(200, function(err, res){
                if(err) return done(err);
                else {
                    // console.log("here" + res.body.suc_msg);
                    expect(res.body.suc_msg).to.equal("Success");

                    done();
                }

            });

    });

    //to test the share status if it is consistent
    test('Share Status Function Test', function(done){
        //we need creat a user at least
        var name = Date.now();
        let new_user = new createoper(name,"1234", "online");
        new_user.createUser(testDB, function(results0, err0){
            expect(err0).to.equal(null);
            dboper.Updatesharestatus(name,"OK", function(err, results) {
                expect(err).to.equal(null);
                dboper.Getsharestatus(name,function(err, results1){
                    console.log("===========" + results1["emergencystatus"]);
                    expect(results1["emergencystatus"]).to.equal("OK");
                    testDB.collection("USERS").drop();
                    done();
                });
            });
        });

    });
})
