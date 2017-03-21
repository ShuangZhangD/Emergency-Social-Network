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


