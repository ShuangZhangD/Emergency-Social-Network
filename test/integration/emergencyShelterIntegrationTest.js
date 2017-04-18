/**
 * Created by Jilei on 4/18/17.
 */

'use strict';

var expect = require('expect.js');
var express = require('express');
var myapp = require('../../app.js');
var request = require('supertest').agent(myapp.listen());

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var express = require('express');

//var emergencyShelterCtrl = require("../../controller/EmergencyShelterCtrl.js");
//emergencyShelterCtrl.initData();
//setTimeout(function () {}, 3000);

var DBConfig = require("../../controller/DBConfig");
let dbconfig = new DBConfig();
var url = dbconfig.getURL();
var error_url = "mongodb://root:123@ds137730.mlab.com:37730/esns";

var City = require("../../models/City.js");
var MyLocation = require("../../models/MyLocation.js");


var mountain_view = {
    "name" : "Mountain View Mock",
    "location" : [37.410406, -122.05967899999999],
    "shelter" : [
        {
            "name": "CMU-SV",
            "location" : [37.410406, -122.05967899999999],
            "address" : "Moffett Field, CA 94035"
        },
        {
            "name": "Nasa Research Park",
            "location" : [37.411406, -122.04977899999999],
            "address" : "Moffett Field, CA 94035"
        },
        {
            "name": "Mountain View Downtown",
            "location" : [37.4008179,-122.0857112],
            "address" : "500 Castro St, CA 94041"
        }
    ]
};

suite('Emergency Shelter Integration Tests', function(){
    this.timeout(15000);

    test('Get Emergency Shelter by Location by RESTful Api', function(done) {
        //let city1 = new City(mountain_view);
        //city1.initDB();
        request.get('/shelter_by_location/37.410406/-122.05967899999999')
            .expect(200, function(err, res) {
                //console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
                //console.log(res.body);
                expect(res.body.success).to.equal(1);
                done();
            });
    });

    test('Get Emergency Shelter by Search City by RESTful Api', function(done) {
        //let city1 = new City(mountain_view);
        //city1.initDB();
        request.get('/shelter_search/San')
            .expect(200, function(err, res) {
                //console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
                //console.log(res.body);
                expect(res.body.success).to.equal(1);
                done();
            });
    });


});
