"use strict";

var esnAdmin = require("../models/ESNAdmin");
var dboper = require("../models/ProfileManagementDBOper");
var DBConfig = require("./DBConfig");
let dbconfig = new DBConfig();
var url = dbconfig.getURL();

class ProfileManagementController {

    updateProfile(req, res){
        var info = req.body;
        var profileusername = info["profileusername"];
        dboper.updateProfileForUser(profileusername, info, url, function (err, results) {
            if (err) {
                console.log("Error:"+ err);
                res.json({success:0, err_type: 1, err_msg:results});
            }
            else {
                res.json({success:1, suc_msg: "Success"});
            }
        });
    }

    getProfile(req, res){
        var profileusername = req.params.profileusername;
        dboper.getProfileForUser(profileusername, url, function(err, results){
            if(err) {
                res.json({success:0, err_type: 1, err_msg:"Database Error"});
            }
            else {
                res.json({success:1, data: results});
            }
        });
    }
    updateName(req, res){
        var info = req.body;
        var profileusername = info["profileusername"];
        console.log("going to call");
        dboper.updateName(profileusername, info, url, function (err, results) {
            if (err) {
                res.json({success:0, err_type: 1, err_msg:results});
            }
            else {
                res.json({success:1, suc_msg: "Success"});
            }
        });
    }

    updateAccountStatus(req, res){
        var info = req.body;
        var profileusername = info["profileusername"];

        dboper.updateAccountStatus(profileusername, info, url, function (err, results) {
            if (err) {
                res.json({success:0, err_type: 1, err_msg:results});
            }
            else {
                res.json({success:1, suc_msg: "Success"});
            }
        });
    }
    checkDefaultAdmin(callback) {
        esnAdmin.init(url, callback);
    }
}

let pmc = new ProfileManagementController();

module.exports = {
    updateProfile : pmc.updateProfile,
    getProfile : pmc.getProfile,
    checkDefaultAdmin : pmc.checkDefaultAdmin,
    updateName : pmc.updateName,
    updateAccountStatus : pmc.updateAccountStatus
};
