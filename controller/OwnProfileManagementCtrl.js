"use strict";

var dboper = require("../models/OwnProfileManagementDBOper");
var DBConfig = require("./DBConfig");
let dbconfig = new DBConfig();
var url = dbconfig.getURL();

class OwnProfileManagementController {

    updateOwnProfile(req, res){
        console.log("In updateProfile in OwnProfileManagementCtrl");
        var info = req.body;
        var username = info["username"];
        dboper.updateOwnProfileForUser(username, info, url, function (err, results) {
            if (err) {
                res.json({success:0, err_type: 1, err_msg:results});
            }
            else {
                res.json({success:1, suc_msg: "Success"});
            }
        });
    }

    getOwnProfile(req, res){
        console.log("In getProfile in OwnProfileManagementCtrl");
        var username = req.params.username;
        dboper.getOwnProfileForUser(username, url, function(err, results){
            if(err) {
                res.json({success:0, err_type: 1, err_msg:"Database Error"});
            }
            else {
                res.json({success:1, data: results});
            }
        });
    }
}

let pmc = new OwnProfileManagementController();

module.exports = {
    updateOwnProfile : pmc.updateOwnProfile,
    getOwnProfile : pmc.getOwnProfile
};
