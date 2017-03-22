/**
 * Created by keqinli on 3/18/17.
 */
var express = require('express');
var myParser = require("body-parser");

var dboper = require("../models/ShareStatusDBoper");
var app = express();

class ShareStatusController {
    AddShareStatus(req, res){
        //console.log(res)
        console.log("Inside Sharestatuscontroller");
		var info = req.body;
        var username = info["username"];
        var status=info["emergencystatus"];
		console.log("After inits");
        //update database through ShareStatusDBoper.updatesharestatus
        dboper.Updatesharestatus(username, status, function (err, results) {
            console.log("inside sharestatuscontroller again");
			if (err) {
                console.log('Error:'+ err);
                res.json({success:0, err_type: 1, err_msg:"Database Error"});
            } else {
               console.log("else in sharestatuscontroller");
				 res.json({success:1, suc_msg: "Success"});
            }});
    }

    GetShareStatus(req, res){
        var info=req.body;
        var username = info["username"];
      
        username = req.param("username");


        dboper.Getsharestatus(username, function(err, results){
            if(err) {
                console.log('Error:' +err);
                res.json({success:0, err_type: 1, err_msg:"Database Error"});
            } else {
                res.json({success:1, data: results});
            }

        });
    }
    //
    UpdateShareStatusSocket(socket){
        return function(data) {
            socket.emit('Update Share Status', data);
            socket.broadcast.emit('Update Share Status', data);
        };
    }


}

let ssc = new ShareStatusController();

module.exports = {
    AddShareStatus : ssc.AddShareStatus,
    GetShareStatus : ssc.GetShareStatus,
    UpdateShareStatusSocket : ssc.UpdateShareStatusSocket
}
