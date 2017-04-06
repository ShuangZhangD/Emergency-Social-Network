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
var dboper = require("../../models/PostAnnouncementDBoper.js");

var app = express();
var error_url = "mongodb://root:123@ds137730.mlab.com:37730/esns";


//var url = 'mongodb://root:1234@ds137730.mlab.com:37730/esnsv7';//url = 'mongodb://root:1234@ds135690.mlab.com:35690/esntest';
var TestDBConfig = require("../TestDBConfig");
let dbconfig = new TestDBConfig();
var url = dbconfig.getURL();
//using server not app to listening port 5000
var server = request.agent("https://quiet-peak-31270.herokuapp.com");
// var server = request.agent(HOST);

suite('Post Announcement Unit Tests', function(){
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

    test('Testing Announcement Function', function(done){
        dboper.InsertAnnouncement("keqin", "testing announcement function in Unit Test", Date.now(), url, function (err, results1){
            dboper.LoadAnnouncement(url, function (err, results2) {
               expect(results2[results2.length-1]["announcement"]).to.equal("testing announcement function in Unit Test");
               done();
            });
        });
    });

    test('Testing Announcement Function DB Error', function(done){
        dboper.InsertAnnouncement("keqin", "testing announcement function in Unit Test", Date.now(), error_url, function(err,result){
            //dboper.LoadAnnouncement(url, function (err, results2) {
                expect(err).to.equal(400);
                done();
            //});
        });
    });

    test('Testing Load Announcement Function DB Error', function(done){
        dboper.LoadAnnouncement(error_url, function(err,result){
            //dboper.LoadAnnouncement(url, function (err, results2) {
            expect(err).to.equal(400);
            done();
            //});
        });
    });

    test('Announcement  Search  erro in db', function(done){
        //let dboper = new PublicChatDBoper("keqin", "test1000lkq", url);
        dboper.SearchPublicAnn([""], error_url,function(err, result){
            expect(err).to.equal(400);
            done();
        });
    });

    test('Test Public Chat Search Function in models', function(done){
        dboper.InsertAnnouncement("keqin", "testing announcement function in Unit Test", Date.now(), url, function(err0,content0){
            expect(err0).to.equal(null);
            dboper.SearchPublicAnn(["chat", "hi"], url,function(err1, results1){
                expect(err1).to.equal(200); //TODO test if results content equal or not
                done();
            });
        });
    });

});
