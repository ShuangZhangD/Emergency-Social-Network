/**
 * Created by keqinli on 3/21/17.
 */
'use strict';

var expect = require('expect.js');
// var request = require('supertest');
var express = require('express');

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var express = require('express');

//var ShareStatusCtrl = require('../controller/ShareStatusCtrl');
//var PrivateChatCtrl = require('../controller/PrivateChatCtrl.js');
// var PrivateChatDBOper = require("../../models/PrivateChatDBOper.js");
var error_url = "mongodb://root:123@ds137730.mlab.com:37730/esns";

var app = express();
var myapp = require('../../app.js');
var request = require('supertest').agent(myapp.listen());

//var url = 'mongodb://root:1234@ds137730.mlab.com:37730/esnsv7';
var TestDBConfig = require("../TestDBConfig");
let dbconfig = new TestDBConfig();
var url = dbconfig.getURL();

//using request not app to listening port 5000
// var request = request.agent("https://quiet-peak-31270.herokuapp.com");
// var request = request.agent("http://localhost:5000");

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
        request.get('/privatechat/:sender/:receiver')
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
        request.post('/privatechat')
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
        request.get('/privatechat/:receiver')
            .send({"receiver": "test1000lkq"})
            .expect(200, function(err, res){
                if(err) return done(err);
                else {
                    expect(res.body.success).to.equal(1);
                    done();
                }

            });
    });

    test('Test Private Chat Search from RESTFul Api', function(done){
       request.post('/privatechat/search/'+ "test1000lkq")
           .send(["chat","hi"])
           .expect(200,function(err, res){
               if(err) return done(err);
               else {
                   expect(res.body.success).to.equal(1);
                   done();
               }
           })
    });

});
