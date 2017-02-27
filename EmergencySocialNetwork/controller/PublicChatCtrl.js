/**
 * Created by shuang on 2/26/17.
 */

var express = require('express');
var myParser = require("body-parser");
var dboper = require("../models/PublicChatDBoper.js");
var app = express();

module.exports = {
    LoadPublicMessage : function(req, res){
        dboper.LoadPublicMessage(function (err, results) {
            if (err) {
                console.log('Error:'+ err);
            } else {
                res.status(200).json(results);
            }
        });
    },

    AddPublicMessage : function (req, res) {
        dboper.InsertMessage(req.sender, req.receiver, req.message, "public", new Date(), function (err, results) {
            if (err) {
                console.log('Error:'+ err);
            } else {
                res.status(200).json(results);
            }});
    }
};