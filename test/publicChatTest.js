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
var dboper = require("../models/PublicChatDBoper.js");

var app = express();


//var url = 'mongodb://root:1234@ds137730.mlab.com:37730/esnsv7';//url = 'mongodb://root:1234@ds135690.mlab.com:35690/esntest';
var TestDBConfig = require("./TestDBConfig");
let dbconfig = new TestDBConfig();
var url = dbconfig.getURL();

//using server not app to listening port 5000
var server = request.agent("https://quiet-peak-31270.herokuapp.com");
// var server = request.agent("http://localhost:5000");

suite('Public Chat Tests', function(){
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
            done();
        });
        //done();

    });

    //after all tests, close mongodb
    suiteTeardown('Close DB for Test', function(done){
        //testDB.collection("MESSAGES").drop();
        //testDB.collection("announcement").drop();
        //testDB.collection("USERS").drop();
        testDB.close();
        done();
    });

    test('Getting Public Chat Through RESTful Api', function(done){
        server.get('/public')
            .expect(200, function(err, res){
            if(err) return done(err);
            else {
                // for(var i=0; i<res.body.data.length; i++){
                //     console.log(res.body.data[i]["announcement"]);
                // }

                done();
            }
                //done();
        });

    });

    test('Public Chat Through RESTful Api', function(done){
        server.post('/public')
            .send({"username": "keqin", "pubmsg": "hello from Test", "emergencystatus": "OK","timeStamp": Date.now()})
            .expect(200, function(err,res){
                if(err) return done(err);
                else {
                    console.log(res.body.suc_msg);
                    //expect
                    expect(res.body.suc_msg).to.equal("Success");
                    done();
                }
            });
    });

    test('Testing Announcement Function', function(done){
        dboper.InsertMessage("keqin", "","testing public chat function in Unit Test", "public",Date.now(), "OK",url, function (err, results1){
            dboper.LoadPublicMessage(url, function (err, results2) {
               expect(results2[results2.length-1]["pubmsg"]).to.equal("testing public chat function in Unit Test");
               done();
            });
        });
    });

});