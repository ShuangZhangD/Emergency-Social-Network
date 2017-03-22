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
var dboper = require("../models/PostAnnouncementDBoper.js");

var app = express();


var url = 'mongodb://root:1234@ds135690.mlab.com:35690/esntest';

//using server not app to listening port 5000
var server = request.agent("https://quiet-peak-31270.herokuapp.com");

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
            done();
        });
        //done();

    });

    //after all tests, close mongodb
    suiteTeardown('Close DB for Test', function(done){
        testDB.close();
        done();
    });

    test('Getting Announcement Through RESTful Api', function(done){
        server.get('/announcement')
            .expect(200, function(err, res){
            if(err) return done(err);
            else {
                for(var i=0; i<res.body.data.length; i++){
                    console.log(res.body.data[i]["announcement"]);
                }

                done();
            }

        });

    });

    test('Posting Announcement Through RESTful Api', function(done){
        server.post('/post_announcement')
            .send({"username": "keqin", "announcement": "testing from Unit Test"})
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
        dboper.InsertAnnouncement("keqin", "testing announcement function in Unit Test", Date.now(), function (err, results1){
            dboper.LoadAnnouncement(function (err, results2) {
               expect(results2[results2.length-1]["announcement"]).to.equal("testing announcement function in Unit Test");
               done();
            });
        });
    });

})