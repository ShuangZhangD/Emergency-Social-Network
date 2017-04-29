"use strict";

var dboper = require("../models/ProfileManagementDBoper");
var DBConfig = require("./DBConfig");
let dbconfig = new DBConfig();
var url = dbconfig.getURL();

class ProfileManagementController {

    updateProfile(req, res){
        console.log("In updateProfile in ProfileManagementCtrl");
        var info = req.body;
        // console.log(req);
        var profileusername = info["profileusername"];

        dboper.updateProfileForUser(profileusername, info, url, function (err, results) {
            if (err) {
                // console.log("Error:"+ err);
                res.json({success:0, err_type: 1, err_msg:results});
            }
            else {
                //console.log(results);
                res.json({success:1, suc_msg: "Success"});
            }
        });
    }

    getProfile(req, res){
        console.log("In getProfile in ProfileManagementCtrl");
        //var info=req.body;
        //var username = info["username"];
        var profileusername = req.params.profileusername;
        dboper.getProfileForUser(profileusername, url, function(err, results){
            if(err) {
                // console.log("Error:" +err);
                res.json({success:0, err_type: 1, err_msg:"Database Error"});
            }
            else {
                res.json({success:1, data: results});

            }
        });
    }
    updateName(req, res){
        console.log("In updateName in ProfileManagementCtrl");
        var info = req.body;
        // console.log(req);
        var profileusername = info["profileusername"];
        console.log("going to call");
        dboper.updateName(profileusername, info, url, function (err, results) {
            if (err) {
                // console.log("Error:"+ err);
                res.json({success:0, err_type: 1, err_msg:results});
            }
            else {
                //console.log(results);
                res.json({success:1, suc_msg: "Success"});
            }
        });
    }

    updateAccountStatus(req, res){
        console.log("In updateAccountStatus in ProfileManagementCtrl");
        var info = req.body;
        // console.log(req);
        var profileusername = info["profileusername"];

        dboper.updateAccountStatus(profileusername, info, url, function (err, results) {
            if (err) {
                // console.log("Error:"+ err);
                res.json({success:0, err_type: 1, err_msg:results});
            }
            else {
                //console.log(results);
                res.json({success:1, suc_msg: "Success"});
            }
        });
    }

    checkDefaultAdmin(callback) {

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
