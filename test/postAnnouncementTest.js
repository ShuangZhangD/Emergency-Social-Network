/**
 * Created by keqinli on 3/20/17.
 */

var expect = require('expect.js');

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var express = require('express');

var url = 'mongodb://localhost:27017/test3';

suite('Post Announcement Tests', function(){

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
    });

    test('Creating An Announcement in DB', function(done){
        console.log('Test Creating An Announcement in DB');
        //expect(2).to.eql(2);
        done();
    });
})