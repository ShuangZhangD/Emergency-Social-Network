/**
 * Created by keqinli on 3/20/17.
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

    test('Getting Share Status Through RESTful Api', function(done){
        //request(app).get('/announcement').expect("Content-type",/json/)
        server.get('/userstatus/:username')
            .send({"username": "keqin"})
            .expect(200, function(err, res){
                if(err) return done(err);
                else {

                    expect(res.body.success).to.equal(1);

                    done();
                }

            });

    });

    test('Changing Share Status Through RESTful Api', function(done){
        //request(app).get('/announcement').expect("Content-type",/json/)
        server.post('/userstatus')
            .send({"username": "mary", "emergencystatus": "OK"})
            .expect(200, function(err, res){
                if(err) return done(err);
                else {
                    // for(var i=0; i<res.body.data.length; i++){
                    //     console.log(res.body.data[i]["announcement"]);
                    // }
                    expect(res.body.suc_msg).to.equal("Success");

                    done();
                }

            });

    });
    //to test the share status if it is consistent
    test('Share Status Function Test', function(done){
         var fake= {"body" : {
            "username": "mary",
            "emergencystatus": "OK"
        }
         }

        ShareStatusCtrl.AddShareStatus(fake, function(res){
            expect(res.body.suc_msg).to.equal("Success");
            ShareStatusCtrl.GetShareStatus({"username": "keqin"}, function(data){
                expect(data.body.data).to.equal("OK");
            });
        });

        done();

    });
})
