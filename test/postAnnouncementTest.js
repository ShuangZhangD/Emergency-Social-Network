/**
 * Created by keqinli on 3/20/17.
 */

var expect = require('expect.js');

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var express = require('express');

var url = 'mongodb://root:1234@ds135700.mlab.com:35700/esnsv7';

suite('Post Announcement Tests', function(){

    suiteSetup()

    test('Creating An Announcement in DB', function(done){
        console.log('Test Creating An Announcement in DB');
        expect(2).to.eql(2);
        done();
    });
})