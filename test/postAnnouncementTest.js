/**
 * Created by keqinli on 3/20/17.
 */

var expect = require('expect.js');
var request = require('supertest');
var express = require('express');

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var express = require('express');

var app = express();


var url = 'mongodb://localhost:27017/test3';

//using server not app to listening port 5000
var server = request.agent("http://localhost:5000");

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
        done();
    });

    test('Getting Announcement Through RESTful Api', function(done){
        console.log('Test Creating An Announcement in DB');
        //expect(2).to.eql(2);
        //request(app).get('/announcement').expect("Content-type",/json/)
        server.get('/announcement')
            .expect(200, function(err, res){
            if(err) return done(err);
            else {
                //console.log("TYPE "+typeof(res.body.data));
                //console.dir("DATA "+res.body.data);
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
})