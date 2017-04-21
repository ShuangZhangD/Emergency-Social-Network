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

    test('Group Chat Get All Group', function(done){
        let dboper = new GroupChatDBOper("testgroup","shuang", url);
        dboper.createGroup(function(err, content){
            dboper.getAllGroupList(function(statuscode, content){
                expect(err).to.equal(null);
                expect(content[content.length-1]).to.equal("testgroup");
                done();
            });
        });
    });
    test('Group Chat Get My Group', function(done){
        let dboper = new GroupChatDBOper("testgroup","shuang", url);
        dboper.createGroup(function(err, content){
            dboper.getMyGroupList(function(statuscode, content){
                expect(err).to.equal(null);
                expect(content[content.length-1]["group"]).to.equal("testgroup");
                done();
            });
        });
    });
    test('Group Chat Join Group', function(done){
        let dboper = new GroupChatDBOper("testgroup","shuang", url);
        dboper.createGroup(function(err, content){
            dboper.joinGroup(function(err, content){
                dboper.getMyGroupList(function(statuscode, content){
                    expect(err).to.equal(null);
                    expect(content[content.length-1]["group"]).to.equal("testgroup");
                    done();
                });
            });
        });
    });

    test('Group Chat Leave Group', function(done){
        let dboper = new GroupChatDBOper("testgroup","shuang", url);
        dboper.createGroup(function(err, content){
            dboper.leaveGroup(function(err, content){
                expect(err).to.equal(null);
                done();
            });
        });
    });

    test('Group Chat Create Group', function(done){
        let dboper = new GroupChatDBOper("testgroup","shuang", url);
        dboper.createGroup(function(err, content){
            expect(err).to.equal(null);
            done();
        });
    });

    test('Group Chat Post Group Message', function(done){
        let dboper = new GroupChatDBOper("testgroup","shuang", url);
        var fake = {
            "sender": "keqin",
            "receiver": "testgroup",
            "message": "group chat function",
            "type": "group",
            "emergencystatus": "OK",
            "timestamp": ""
        };
        dboper.InsertMessage(fake,function(statuscode, content){
            expect(statuscode).to.equal(200);
            done();
        });
    });

    test('Group Chat Get Group Message', function(done){
        let dboper = new GroupChatDBOper("testgroup","shuang", url);
        var fake = {
            "sender": "keqin",
            "receiver": "testgroup",
            "message": "group chat function",
            "type": "group",
            "emergencystatus": "OK",
            "timestamp": ""
        };
        dboper.InsertMessage(fake, function(statuscode, content){
            expect(statuscode).to.equal(200);

            dboper.LoadHistoryMsg(fake,function(statuscode, content){
                //expect(data.body.data).to.equal("OK");
                expect(statuscode).to.equal(200);

                //console.log(content[content.length-1]["private_msg"]);
                done();
            });
        });
    });


    test('Group Chat Get All Group DB Error', function(done){
        let dboper = new GroupChatDBOper("testgroup","shuang", error_url);
        dboper.getAllGroupList(function(err, content){
            expect(err).to.equal(400);
            done();
        });
    });

    test('Group Chat Get My Group DB Error', function(done){
        let dboper = new GroupChatDBOper("testgroup","shuang", error_url);
        dboper.getMyGroupList(function(err, content){
            expect(err).to.equal(400);
            done();
        });
    });
    test('Group Chat Join Group DB Error', function(done){
        let dboper = new GroupChatDBOper("testgroup","shuang", error_url);
        dboper.joinGroup(function(err, content){
            expect(err).to.equal(400);
            done();
        });
    });

    test('Group Chat Leave Group DB Error', function(done){
        let dboper = new GroupChatDBOper("testgroup","shuang", error_url);
        dboper.leaveGroup(function(err, content){
            expect(err).to.equal(400);
            done();
        });
    });

    test('Group Chat Create Group DB Error', function(done){
        let dboper = new GroupChatDBOper("testgroup","shuang", error_url);
        dboper.createGroup(function(err, content){
            expect(err).to.equal(400);
            done();
        });
    });

    test('Group Chat Post Group Message DB Error', function(done){
        let dboper = new GroupChatDBOper("testgroup","shuang", error_url);
        var fake = {
            "sender": "keqin",
            "receiver": "testgroup",
            "message": "group chat function",
            "type": "group",
            "emergencystatus": "OK",
            "timestamp": ""
        };
        dboper.InsertMessage(fake,function(statuscode, content){
            expect(statuscode).to.equal(400);
            done();
        });
    });

    test('Group Chat Get Group Message DB Error', function(done){
        let dboper = new GroupChatDBOper("testgroup","shuang", error_url);
        var fake = {
            "sender": "keqin",
            "receiver": "testgroup",
            "message": "group chat function",
            "type": "group",
            "emergencystatus": "OK",
            "timestamp": ""
        };
        dboper.LoadHistoryMsg(fake,function(statuscode, content){

            expect(statuscode).to.equal(400);
            done();
        });
    });



});
