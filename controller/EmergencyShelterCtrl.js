/**
 * Created by Jilei Wang on April 17, 2017.
 */
"use strict";

var DBConfig = require("./DBConfig");
let dbconfig = new DBConfig();
var MongoClient = require("mongodb").MongoClient;
var City = require("../models/City.js");
var MyLocation = require("../models/MyLocation.js");

class EmergencyShelterCtrl {

    constructor() {
        //
    }

    initData() {
        var jsonFile = require("../data/EmergencyShelters.json");
        jsonFile.cityList.forEach(function(json) {
            let city = new City(json);
            city.initDB();
        });
        console.log("Emergency Shelter Information Updated!");
    }

    getResultByLocation(req, res) {
        var latitude = parseFloat(req.params.latitude);
        var longitude = parseFloat(req.params.longitude);
        let location = new MyLocation([latitude, longitude]);
        location.findCity(function (err, result) {
            if(err){
                res.json({success:0, err_type: 1, err_msg:"Database Error"});
            }else{
                if (result.length === 0) {
                    res.json({success:0, err_type: 2, err_msg:"No city found!"});
                }
                else {
                    res.json({success:1, data: result[0]});
                }
            }
        });

    }

    search(req, res) {
        var keywords = req.params.keywords;
        console.log(keywords);
        var keywordList = keywords.match(/\S+/g) || [];
        if (keywordList.length <= 0 || keywordList.length > 5) {
            res.json({success:0, err_type: 2, err_msg:"keywords limit 1 to 5"});
            return;
        }
        let city = new City(null);
        city.search(keywordList, function(success, err_type, result) {
            if (success == 1){
                res.json({success:1, data: result});
            }
            else {
                res.json({success:0, err_type: err_type, err_msg: result});
            }
        });

        
    }

}


let ctrl = new EmergencyShelterCtrl();
module.exports = ctrl;