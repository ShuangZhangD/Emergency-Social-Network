/**
 * Created by Jilei and Komala on 4/01/17.
 */

'use strict';

var expect = require('expect.js');
var request = require('superagent');
var express = require('express');
var app = require("../../app");

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var express = require('express');
var dboper = require("../../models/JoinCommunityDBoper.js");
var dboper2 = require("../../models/ShareStatusDBoper.js");

//var app = express();


//var url = 'mongodb://root:1234@ds137730.mlab.com:37730/esnsv7';//url = 'mongodb://root:1234@ds135690.mlab.com:35690/esntest';
var DBConfig = require("../../controller/DBConfig");
let dbconfig = new DBConfig();
var url = dbconfig.getURL();
var error_url = "mongodb://root:123@ds137730.mlab.com:37730/esns";
var PORT = process.env.PORT | 3000;
//using server not app to listening port 5000
// var server = request.agent("https://quiet-peak-31270.herokuapp.com");
var server = app.listen(PORT);
var HOST = 'http://localhost:' + PORT;

suite('Join Comunity Integration Tests', function(){
    this.timeout(15000);

    test('Login by RESTful Api', function(done) {
        request.post(HOST+'/signup')
            .send({"username": "test_user_for_rest_api", password: "1234"})
            .expect(200, function(err, res) {
                server.post(HOST+'/login')
                    .send({"username": "test_user_for_rest_api", password: "1234"})
                    .expect(200, function(err, res){
                        if(err) {
                            return done(err);
                        }
                        else {
                            var idx = res.body.data.indexOf("test_user_for_rest_api");
                            expect(idx).to.above(-1);
                            done();
                        }
                    });
            });
    });

    test('Signup by RESTful Api', function(done){
        dboper.RemoveUser("test_user_for_rest_api", url, function(success_statuscode, results) {
            request.post('/signup')
                .send({"username": "test_user_for_rest_api", password: "1234"})
                .expect(200, function(err, res){
                    if(err) {
                        return done(err);
                    }
                    else {
                        var idx = res.body.data.indexOf("test_user_for_rest_api");
                        expect(idx).to.above(-1);
                        done();
                    }
                });
        });
    });

    test('Userlist by RESTful Api', function(done) {
        request.post('/signup')
            .send({"username": "test_user_for_rest_api", password: "1234"})
            .expect(200, function(err, res) {
                request.get('/userlist')
                    .expect(200, function(err, res){
                        if(err) {
                            return done(err);
                        }
                        else {
                            var idx = res.body.data1.indexOf("test_user_for_rest_api");
                            if (idx < 0) {
                                idx = res.body.data2.indexOf("test_user_for_rest_api");
                            }
                            expect(idx).to.above(-1);
                            done();
                        }
                    });
            });
    });

    test('Logout by RESTful Api', function(done) {
        request.post('/signup')
            .send({"username": "test_user_for_rest_api", password: "1234"})
            .expect(200, function(err, res) {
                request.post('/logout')
                    .send({"username": "test_user_for_rest_api"})
                    .expect(200, function(err, res){
                        request.get('/userlist')
                            .expect(200, function(err, res){
                                if(err) {
                                    return done(err);
                                }
                                else {
                                    var idx = res.body.data2.indexOf("test_user_for_rest_api");
                                    expect(idx).to.above(-1);
                                    done();
                                }
                            });

                    });
            });
    });
});
