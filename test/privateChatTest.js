/**
 * Created by keqinli on 3/21/17.
 */

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


var url = 'mongodb://localhost:27017/test3';

//using server not app to listening port 5000
var server = request.agent("http://localhost:5000");

suite('Private Chat Test', function(){

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

    //to test the chat private function
    test('Private Chat Function Test', function(done){
        let dboper = new PrivateChatDBOper("keqin", "test1000lkq");
        dboper.InsertMessage("private chat function", function(statuscode, content){
            expect(statuscode).to.equal(200);

            dboper.LoadHistoryMsg(function(statuscode, content){
                //expect(data.body.data).to.equal("OK");
                expect(statuscode).to.equal(200);

                expect(content[content.length-1]["private_msg"]).to.equal("private chat function");
                console.log(content[content.length-1]["private_msg"]);
                done();
            });
        });

        //done();

    });
})

