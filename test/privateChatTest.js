/**
 * Created by keqinli on 3/21/17.
 */
'use strict';

var expect = require('expect.js');
var request = require('supertest');
var express = require('express');

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var express = require('express');

//var ShareStatusCtrl = require('../controller/ShareStatusCtrl');
//var PrivateChatCtrl = require('../controller/PrivateChatCtrl.js');
var PrivateChatDBOper = require("../models/PrivateChatDBOper.js");

var app = express();


var url = 'mongodb://root:1234@ds135690.mlab.com:35690/esntest';

//using server not app to listening port 5000
var server = request.agent("https://quiet-peak-31270.herokuapp.com");
// var server = request.agent("http://localhost:5000");

suite('Private Chat Test', function(){
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

    test('Getting Private Chat from RESTful Api', function(done){
        //request(app).get('/announcement').expect("Content-type",/json/)
        server.get('/privatechat/:sender/:receiver')
            .send({"sender": "keqin", "receiver":"test1000lkq"})
            .expect(200, function(err, res){
                if(err) return done(err);
                else {
                    expect(res.body.success).to.equal(1);
                    done();
                }

            });
    });

    test('Adding Private Message from RESTful Api', function(done){
        server.post('/privatechat')
            .send({"PrivateMsg": "Testing Private Message RESTful Api","sender": "keqin", "receiver":"test1000lkq"})
            .expect(200, function(err, res){
                if(err) return done(err);
                else {
                    expect(res.body.suc_msg).to.equal("Success");
                    done();
                }

            });
    });

    test('Getting Unread Number from RESTful Api', function(done){
        server.get('/privatechat/:receiver')
            .send({"receiver": "test1000lkq"})
            .expect(200, function(err, res){
                if(err) return done(err);
                else {
                    expect(res.body.success).to.equal(1);
                    done();
                }

            });
    });

    //to test message number of a particular receiver
    test('test message number of a particular receiver', function(done){
        let dboper = new PrivateChatDBOper("keqin", "test1000lkq");
        var fake0 = {
            "sender": "keqin",
            "receiver": "test1000lkq",
            "PrivateMsg": "private chat function",
            "emergency_status": "OK",
            "timestamp": ""
        }
        dboper.InsertMessage(fake0, function(statuscode0, content0) {
            expect(statuscode0).to.equal(200);
            dboper.GetCount_IndividualPrivateSender(function (statuscode1, results1) {
                expect(statuscode1).to.equal(200);
                var fake = {
                    "sender": "keqin",
                    "receiver": "test1000lkq",
                    "PrivateMsg": "private chat function",
                    "emergency_status": "OK",
                    "timestamp": ""
                };
                dboper.InsertMessage(fake, function (statuscode2, content2) {
                    expect(statuscode2).to.equal(200);
                    dboper.GetCount_IndividualPrivateSender(function (statuscode3, results3) {
                        expect(statuscode3).to.equal(200);
                        for (var i = 0; i < results3.length; i++) {
                            if (results3[i]["sender"] === "keqin") {
                                expect(results3[i]["count"]).to.equal(results1[i]["count"] + 1);
                            }
                        }
                        done();
                    });
                });
            });
        });

    });

    //to test unread number
    test('Unread Function Test', function(done){
        let dboper = new PrivateChatDBOper("keqin", "test1000lkq");
        dboper.GetCount_IndividualUnreadMsg(function(statuscode1, results1){
            var fake = {
                "sender": "keqin",
                "receiver": "test1000lkq",
                "PrivateMsg": "private chat function",
                "emergency_status": "OK",
                "timestamp": ""
            }
            dboper.InsertMessage(fake, function(statuscode2, content2) {
                expect(statuscode2).to.equal(200);
                dboper.GetCount_IndividualUnreadMsg(function(statuscode3, results3){
                    for(var i=0; i<results3.length; i++){
                        if(results3[i]["sender"] === "keqin"){
                            expect(results3[i]["count"]).to.equal(results1[i]["count"]+1);
                        }
                    }
                    done();
                });
            });
        });

    });


    //to test the chat private function
    test('Private Chat Function Test', function(done){
        let dboper = new PrivateChatDBOper("keqin", "test1000lkq");
        var fake = {
            "sender": "keqin",
            "receiver": "test1000lkq",
            "PrivateMsg": "private chat function",
            "emergency_status": "OK",
            "timestamp": ""
        }
        dboper.InsertMessage(fake, function(statuscode, content){
            expect(statuscode).to.equal(200);

            dboper.LoadHistoryMsg(function(statuscode, content){
                //expect(data.body.data).to.equal("OK");
                expect(statuscode).to.equal(200);

                expect(content[content.length-1]["private_msg"]).to.equal("private chat function");
                //console.log(content[content.length-1]["private_msg"]);
                done();
            });
        });

        //done();

    });


})

