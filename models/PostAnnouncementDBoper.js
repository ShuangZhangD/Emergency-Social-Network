/**
 * Created by shuang on 3/18/17.
 */
"use strict";

var MongoClient = require("mongodb").MongoClient;
var db_err_msg = "Database Error";
var db_err_statuscode = 400;
var success_statuscode = 200;
//var url = "mongodb://root:1234@ds137730.mlab.com:37730/esnsv7";

var db_err_msg = "Database Error";

class PostAnnouncementDBoper {
    InsertAnnouncement (username, announcement, postTime, url, callback) {
        //connect to database
        MongoClient.connect(url, function (err, db) {
            if (err) {
                //console.log("Error:"+ err);
                callback(400, db_err_msg);// DB Error. Here error of connecting to db
            }
            else {
                var collection = db.collection("announcement");
                //insert into table
                var data = [{"username": username, "announcement": announcement, "postTime": postTime}];
                collection.insert(data, callback);
                db.close();
            }
        });
    }

    LoadAnnouncement (url, callback) {
        MongoClient.connect(url, function(err, db) {
            //console.log("Load Announcement connect to "+ url);
            if (err) {
                //console.log("Error1:" + err);
                callback(400, db_err_msg);// DB Error. Here error of connecting to db
            }
            var collection = db.collection("announcement");
            collection.find({}).toArray(function(err, results){
                // if(err)
                // {
                //     //console.log("Error2:"+ err);
                //     callback(err, "Database error");
                // }else {
                    var datas = [];
                    results.forEach(function(result){
                        var data = {};
                        data["username"] = result.username;
                        data["announcement"] = result.announcement;
                        data["timestamp"] = result.postTime;
                        datas.push(data);
                    });
                    callback(err,datas);
                //}
                db.close();
            });
        });
    }

    SearchPublicAnn(words, url, callback) {
        MongoClient.connect(url, function (err, db) {
            if (err) {
                callback(db_err_statuscode, db_err_msg);
            }// DB Error. Here error of connecting to db
            else {
              var collection = db.collection("announcement");
              var datas=[];
              var searchTerm = words[0];
              words.forEach(function(word) {
                  searchTerm=searchTerm+"|"+word;
              });
              var regExWord = new RegExp(".*" + searchTerm + ".*");
              collection.find({ "announcement":  regExWord}).toArray(function(err, results) {

                //  console.log(err);
                      results.forEach(function (result) {
                            //  console.log(result);
                          var data = {};
                          data["username"] = result.username;
                          data["announcement"] = result.announcement;
                          data["timestamp"] = result.postTime;
                          datas.push(data);
                          console.log(data);
                      });
                      callback(success_statuscode, datas);
                    });
                    // if (err) {
                    //     callback(db_err_statuscode, db_err_msg);
                    // }
                    // else {
                    console.log("datassfdsdfsdfsdfsdf");
                    console.log(datas);

                    //}
                    db.close();

            }
        });
    }
}

let postddoper = new PostAnnouncementDBoper();

module.exports = {
    InsertAnnouncement: postddoper.InsertAnnouncement,
    LoadAnnouncement: postddoper.LoadAnnouncement,
    SearchPublicAnn: postddoper.SearchPublicAnn
};
