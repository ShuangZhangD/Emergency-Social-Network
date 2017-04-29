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
        console.log("printing profileusername in ProfileManagementCtrl below");
        console.log(profileusername);

        //FOR TEST
        /*info = {
            "profileusername": "test123",
            "password": "81dc9bdb52d04dc20036dbd8313ed055",
            "accountstatus": "Inactive",
            "privilegelevel": "Citizen",
            "newusername" : "newusername"
        };*/
        //update database through ShareStatusDBoper.updatesharestatus
        dboper.updateProfileForUser(profileusername, info, url, function (err, results) {
            if (err) {
                // console.log("Error:"+ err);
                res.json({success:0, err_type: 1, err_msg:results});
            }
            else {
                res.json({success:1, suc_msg: "Success"});
            }
        });
    }

    getProfile(req, res){
        console.log("In getProfile in ProfileManagementCtrl");
        //var info=req.body;
        //var username = info["username"];
        var profileusername = req.params.profileusername;
        console.log("printing profileusername below 55555555555555");
        console.log(profileusername);
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

    checkDefaultAdmin(callback) {
        
    }

}

let pmc = new ProfileManagementController();

module.exports = {
    updateProfile : pmc.updateProfile,
    getProfile : pmc.getProfile
};
