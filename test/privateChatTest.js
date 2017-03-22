/**
 * Created by keqinli on 3/21/17.
 */

var expect = require('expect.js');
var request = require('supertest');
var express = require('express');

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var express = require('express');

var ShareStatusCtrl = require('../controller/ShareStatusCtrl');

var app = express();


var url = 'mongodb://localhost:27017/test3';

//using server not app to listening port 5000
var server = request.agent("http://localhost:5000");

suite('Share Status Tests', function(){

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
        });
        done();

    });

    //after all tests, close mongodb
    suiteTeardown('Close DB for Test', function(done){
        testDB.close();
        done();
    });


})

