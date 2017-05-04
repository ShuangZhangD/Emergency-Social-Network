/**
 * Created by keqinli on 4/30/17.
 */

"use strict";

var expect = require('expect.js');
var request = require('supertest');
var express = require('express');

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var express = require('express');
var dboper = require("../../models/JoinCommunityDBoper.js");
var dboper2 = require("../../models/ShareStatusDBoper.js");
var dboper3 = require("../../models/OwnProfileManagementDBOper.js");
var User = require("../../models/User.js");

var app = express();


//var url = 'mongodb://root:1234@ds137730.mlab.com:37730/esnsv7';//url = 'mongodb://root:1234@ds135690.mlab.com:35690/esntest';
var DBConfig = require("../TestDBConfig");
let dbconfig = new DBConfig();
var url = dbconfig.getURL();
var error_url = "mongodb://root:123@ds137730.mlab.com:37730/esns";

//using server not app to listening port 5000
//var server = request.agent("https://quiet-peak-31270.herokuapp.com");
var server = request.agent("http://localhost:5000");

suite('Inform Emergency Contact Unit Tests', function(){
    this.timeout(15000);

    test("New User ProfileTestUser SignUp", function(done){
        dboper.RemoveUser("profiletestuser", url, function (statuscode1, content1){
            dboper.AddDB("profiletestuser3", "testpwd", url, function (statuscode1, content1){
                expect(statuscode1).to.equal(200);
            });
        });
        done();
    });

    test("Profile Update and Retrieval for all values", function(done) {
        let data = {
            "firstname" : "firstname",
            "lastname" : "lastname",
            "email" : "emergencyservicenetworkfse@gmail.com",
            "emergencycontact" : "profiletestuser2",
            "contactemail" : "emergencyservicenetworkfse@gmail.com"
        };
        dboper.RemoveUser("profiletestuser", url, function (statuscode1, content1){
            dboper.AddDB("profiletestuser", "testpwd", url, function (statuscode1, content2){
                //console.log("in profile");
                //console.log(statuscode1);
                //console.log(content2);
                dboper3.updateOwnProfileForUser("profiletestuser", data, url, function (err, content3){
                    expect(err).to.equal(null);
                    console.log(err);
                    //console.log(content3);
                    dboper3.getOwnProfileForUser("profiletestuser", url, function(err2, content2) {
                        expect(err2).to.equal(null);
                        /*expect(content2.firstname).to.equal("firstname");
                         expect(content2.lastname).to.equal("lastname");
                         expect(content2.email).to.equal("emergencyservicenetworkfse@gmail.com");
                         expect(content2.emergencycontact).to.equal("profiletestuser2");
                         expect(content2.contactemail).to.equal("emergencyservicenetworkfse@gmail.com");*/
                    });
                });
                done();
            });

        });
    });

    test("Profile Update and Retrieval for just the contact", function(done) {
        let data = {
            "firstname" : "firstname",
            "lastname" : "lastname",
            "email" : "emergencyservicenetworkfse@gmail.com",
            "emergencycontact" : "profiletestuser2",
            "contactemail" : ""
        };
        dboper.RemoveUser("profiletestuser", url, function (statuscode1, content1){
            dboper.AddDB("profiletestuser", "testpwd", url, function (statuscode1, content4){
                dboper3.updateOwnProfileForUser("profiletestuser", data, url, function (err, content3){
                    expect(err).to.equal(null);
                    console.log(err);
                    //console.log(content3);
                    dboper3.getOwnProfileForUser("profiletestuser", url, function(err2, content2) {
                        expect(err).to.equal(null);
                        /*expect(content2.firstname).to.equal("firstname");
                         expect(content2.lastname).to.equal("lastname");
                         expect(content2.email).to.equal("emergencyservicenetworkfse@gmail.com");
                         expect(content2.emergencycontact).to.equal("profiletestuser2");
                         expect(content2.contactemail).to.equal(null);*/
                    });
                });
            });
            done();
        });
    });

    test("Profile Update and Retrieval for just the mail", function(done) {
        let data = {
            "firstname" : "firstname",
            "lastname" : "lastname",
            "email" : "emergencyservicenetworkfse@gmail.com",
            "emergencycontact" : "",
            "contactemail" : "emergencyservicenetworkfse@gmail.com"
        };
        dboper.RemoveUser("profiletestuser", url, function (statuscode1, content1){
            dboper.AddDB("profiletestuser", "testpwd", url, function (statuscode1, content4){
                dboper3.updateOwnProfileForUser("profiletestuser", data, url, function (err, content3){
                    expect(err).to.equal(null);
                    console.log(err);
                    //console.log(content3);
                    dboper3.getOwnProfileForUser("profiletestuser", url, function(err2, content2) {
                        expect(err2).to.equal(null);
                        /*expect(content2.firstname).to.equal("firstname");
                         expect(content2.lastname).to.equal("lastname");
                         expect(content2.email).to.equal("emergencyservicenetworkfse@gmail.com");
                         expect(content2.emergencycontact).to.equal(null);
                         expect(content2.contactemail).to.equal("emergencyservicenetworkfse@gmail.com");*/
                    });
                });
            });
            done();
        });
    });

    test("DB Error Get Profile", function(done) {
        dboper.RemoveUser("profiletestuser", url, function (statuscode1, content1){
            dboper.AddDB("profiletestuser", "testpwd", url, function (statuscode1, content1){
                console.log(statuscode1);
                //console.log(content1);
                dboper3.getOwnProfileForUser("profiletestuser", error_url, function(statuscode, content2) {
                    expect(statuscode).to.equal(400);
                });
            });
            done();
        });
    });

    test("Profile Update DB error", function(done) {
        let data = {
            "firstname" : "firstname",
            "lastname" : "lastname",
            "email" : "emergencyservicenetworkfse@gmail.com",
            "emergencycontact" : "profiletestuser2",
            "contactemail" : "emergencyservicenetworkfse@gmail.com"
        };
        dboper.RemoveUser("profiletestuser", url, function (statuscode1, content1){
            dboper.AddDB("profiletestuser", "testpwd", url, function (statuscode1, content2){
                //console.log("in profile");
                //console.log(statuscode1);
                //console.log(content2);
                dboper3.updateOwnProfileForUser("profiletestuser", data, error_url, function (err, content3){
                    expect(err).to.not.equal(null);
                    console.log(err);
                    //console.log(content3);
                    dboper3.getOwnProfileForUser("profiletestuser", error_url, function(statuscode, content4) {
                        expect(statuscode).to.equal(400);
                        /*expect(content2.firstname).to.equal("firstname");
                         expect(content2.lastname).to.equal("lastname");
                         expect(content2.email).to.equal("emergencyservicenetworkfse@gmail.com");
                         expect(content2.emergencycontact).to.equal("profiletestuser2");
                         expect(content2.contactemail).to.equal("emergencyservicenetworkfse@gmail.com");*/
                    });
                });
                done();
            });

        });
    });

});
