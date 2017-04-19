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
var GroupChatDBOper = require("../../models/GroupChatDBOper.js");
var error_url = "mongodb://root:123@ds137730.mlab.com:37730/esns";

var app = express();


//var url = 'mongodb://root:1234@ds137730.mlab.com:37730/esnsv7';
var TestDBConfig = require("../TestDBConfig");
let dbconfig = new TestDBConfig();
var url = dbconfig.getURL();

//using server not app to listening port 5000
// var server = request.agent("https://quiet-peak-31270.herokuapp.com");
// var server = request.agent("http://localhost:5000");

suite('Group Chat Test', function(){
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
        testDB.close();
        done();
    });

    test('Test Get All Group List in models', function(done){
        let dboper = new GroupChatDBOper("","", url);
        dboper.getAllGroupList(function(statuscode, content){
            console.log("get all groups"+content);
            res.json({data: content});
        });
    });

    test('Test Update Unread Chat Msg in models', function(done){
        let dboper = new PrivateChatDBOper("keqin", "test1000lkq", url);
        var fake0 = {
            "sender": "keqin",
            "receiver": "test1000lkq",
            "message": "private chat function: hi",
            "type": "private",
            "emergencystatus": "OK",
            "timestamp": ""
        };
        dboper.InsertMessage(fake0, function(statuscode0, content0){
            expect(statuscode0).to.equal(200);
            dboper.UpdateReadStatus(function(statuscode1,content1){
                expect(statuscode1).to.equal(200);
                done();
            });
        });
    });

    //to test message number of a particular receiver
    test('test message number of a particular receiver', function(done){
        let dboper = new PrivateChatDBOper("keqin", "test1000lkq", url);
        var fake0 = {
            "sender": "keqin",
            "receiver": "test1000lkq",
            "message": "private chat function",
            "type": "private",
            "emergencystatus": "OK",
            "timestamp": ""
        }
        dboper.InsertMessage(fake0, function(statuscode0, content0) {
            expect(statuscode0).to.equal(200);
            dboper.GetCount_IndividualPrivateSender(function (statuscode1, results1) {
                expect(statuscode1).to.equal(200);
                var fake = {
                    "sender": "keqin",
                    "receiver": "test1000lkq",
                    "message": "private chat function",
                    "type": "private",
                    "emergencystatus": "OK",
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
        let dboper = new PrivateChatDBOper("keqin", "test1000lkq", url);
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
        let dboper = new PrivateChatDBOper("keqin", "testgroup", url);
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

    test('Private Chat Insert Msg DB Error', function(done){
        let dboper = new PrivateChatDBOper("keqin", "test1000lkq", error_url);
        var fake = {
            "sender": "keqin",
            "receiver": "test1000lkq",
            "PrivateMsg": "private chat function",
            "emergency_status": "OK",
            "timestamp": ""
        };
        dboper.InsertMessage(fake, function(err, result){
            expect(err).to.equal(400);
            done();
        });
    });

    test('Private Chat Load History Msg DB Error', function(done){
        let dboper = new PrivateChatDBOper("keqin", "test1000lkq", error_url);
        dboper.LoadHistoryMsg(function(err, result){
            expect(err).to.equal(400);
            done();
        });
    });

    test('Private Chat Update Read Statue DB Error', function(done){
        let dboper = new PrivateChatDBOper("keqin", "test1000lkq", error_url);
        dboper.UpdateReadStatus(function(err, result){
            expect(err).to.equal(400);
            done();
        });
    });

    test('Private Chat GetCount_IndividualUnreadMsg DB Error', function(done){
        let dboper = new PrivateChatDBOper("keqin", "test1000lkq", error_url);
        dboper.GetCount_IndividualUnreadMsg(function(err, result){
            expect(err).to.equal(400);
            done();
        });
    });

    test('Private Chat GetCount_IndividualPrivateSender DB Error', function(done){
        let dboper = new PrivateChatDBOper("keqin", "test1000lkq", error_url);
        dboper. GetCount_IndividualPrivateSender(function(err, result){
            expect(err).to.equal(400);
            done();
        });
    });

    test('Private Chat SearchMessages DB Error', function(done){
        let dboper = new PrivateChatDBOper("keqin", "test1000lkq", error_url);
        dboper. SearchMessages("","",function(err, result){
            expect(err).to.equal(400);
            done();
        });
    });


});
