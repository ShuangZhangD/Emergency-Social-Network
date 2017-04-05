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
var dboper = require("../../models/PublicChatDBoper.js");
var error_url = "mongodb://root:123@ds137730.mlab.com:37730/esns";

var app = express();


//var url = 'mongodb://root:1234@ds137730.mlab.com:37730/esnsv7';//url = 'mongodb://root:1234@ds135690.mlab.com:35690/esntest';
var TestDBConfig = require("../TestDBConfig");
let dbconfig = new TestDBConfig();
var url = dbconfig.getURL();

//using server not app to listening port 5000
var server = request.agent("https://quiet-peak-31270.herokuapp.com");
// var server = request.agent("http://localhost:5000");

suite('Public Chat Unit Tests', function(){
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

    test('Testing Public Chat Function', function(done){
        dboper.InsertMessage("keqin", "","testing public chat function in Unit Test", "public",Date.now(), "OK",url, function (err, results1){
            dboper.LoadPublicMessage(url, function (err, results2) {
               expect(results2[results2.length-1]["pubmsg"]).to.equal("testing public chat function in Unit Test");
               done();
            });
        });
    });

    test('Testing Public Chat Function with err_url', function(done){
        dboper.InsertMessage("keqin", "","testing public chat function in Unit Test err_url", "public",Date.now(), "OK",error_url, function (err, results1){
            expect(err).to.equal(400);
            done();
        });
    });

    test('Testing Public Load Function with err_url', function(done){
        dboper.InsertMessage("keqin", "","testing public chat function in Unit Test err_url", "public",Date.now(), "OK",url, function (err, results1){
            expect(err).to.equal(null);
            dboper.LoadPublicMessage(error_url, function (err, results2) {
                expect(err).to.equal(400);
                done();
            });
        });
    });

});
