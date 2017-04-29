"use strict";
var express = require("express");
var dboper = require("../models/JoinCommunityDBoper.js");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var md5 = require("md5");
var reserved_usernames = ["about", "access", "account", "accounts", "add", "address", "adm", "admin", "administration", "adult", "advertising", "affiliate", "affiliates", "ajax", "analytics", "android", "anon", "anonymous", "api", "app", "apps", "archive", "atom", "auth", "authentication", "avatar", "backup", "banner", "banners", "bin", "billing", "blog", "blogs", "board", "bot", "bots", "business,", "chat", "cache", "cadastro", "calendar", "campaign", "careers", "cgi", "client", "cliente", "code", "comercial", "compare", "config", "connect", "contact", "contest", "create", "code", "compras", "css", "dashboard", "data", "db", "design", "delete", "demo", "design", "designer", "dev", "devel", "dir", "directory", "doc", "docs", "domain", "download", "downloads", "edit", "editor", "email", "ecommerce", "forum", "forums", "faq", "favorite", "feed", "feedback", "flog", "follow", "file", "files", "free", "ftp", "gadget", "gadgets", "games", "guest", "group", "groups", "help", "home", "homepage", "host", "hosting", "hostname", "html", "http", "httpd", "https", "hpg", "info", "information", "image", "img", "images", "imap", "index", "invite", "intranet", "indice", "ipad", "iphone", "irc", "java", "javascript", "job", "jobs", "js", "knowledgebase", "log", "login", "logs", "logout", "list", "lists", "mail", "mail1", "mail2", "mail3", "mail4", "mail5", "mailer", "mailing", "mx", "manager", "marketing", "master", "me", "media", "message", "microblog", "microblogs", "mine", "mp3", "msg", "msn", "mysql", "messenger", "mob", "mobile", "movie", "movies", "music", "musicas", "my", "name", "named", "net", "network", "new", "news", "newsletter", "nick", "nickname", "notes", "noticias", "ns", "ns1", "ns2", "ns3", "ns4", "old", "online", "operator", "order", "orders", "page", "pager", "pages", "panel", "password", "perl", "pic", "pics", "photo", "photos", "photoalbum", "php", "plugin", "plugins", "pop", "pop3", "post", "postmaster", "postfix", "posts", "profile", "project", "projects", "promo", "pub", "public", "python", "random", "register", "registration", "root", "ruby", "rss", "sale", "sales", "sample", "samples", "script", "scripts", "secure", "send", "service", "shop", "sql", "signup", "signin", "search", "security", "settings", "setting", "setup", "site", "sites", "sitemap", "smtp", "soporte", "ssh", "stage", "staging", "start", "subscribe", "subdomain", "suporte", "support", "stat", "static", "stats", "status", "store", "stores", "system", "tablet", "tablets", "tech", "telnet", "test", "test1", "test2", "test3", "teste", "tests", "theme", "themes", "tmp", "todo", "task", "tasks", "tools", "tv", "talk", "update", "upload", "url", "user", "username", "usuario", "usage", "vendas", "video", "videos", "visitor", "win", "ww", "www", "www1", "www2", "www3", "www4", "www5", "www6", "www7", "wwww", "wws", "wwws", "web", "webmail", "website", "websites", "webmaster", "workshop", "xxx", "xpg", "you", "yourname", "yourusername", "yoursite", "yourdomain"];
var DBConfig = require("./DBConfig");
let dbconfig = new DBConfig();
var url = dbconfig.getURL();
var Validate = function(username, password){
    if( /\w{3,}/.test(username) && /\w{4,}/.test(password) )
    {
        for(var i=0; i<reserved_usernames.length;i++) {
            if(username === reserved_usernames[i]) {
                return false;
            }
        }
        return true;
    }
    else {
        return false;
    }
};

var SortUserList = function(userlist)
//userlist should be an array of users
{
    return userlist.sort();
};

var IfKeyWordExist = function (key_words, msg){
    for(var i = 0 ; i < key_words.length ; i++){
        if(msg != null && msg.includes(key_words[i]))
            return true;
    }
    return false;
};

class JoinCommunityController {
/*
    Validate (username, password) {
        if( /\w{3,}/.test(username) && /\w{4,}/.test(password) )
            return true;
        else
            return false;
    }*/

    SortUserList (userlist) {
        //userlist should be an array of users
        return userlist.sort();
    }


    LoginCommunity (req, res) {
        var info = req.body;
        var username = info["username"];
        var password = info["password"];
        var encry_password = md5(password);

        //validate the username and password
        if(!Validate(username, password)) {
            res.json({success:0, err_type:4, err_msg: "username or password invalid"}); //username or password invalid
        }
        else {
            dboper.Login(username, encry_password, url, function(statuscode, content){
                if(statuscode != 200){
                    if(statuscode == 400)
                        res.json({success:0, err_type: 1, err_msg:content});
                    else if(statuscode == 401)
                        res.json({success:0, err_type: 2, err_msg:content});
                    else if(statuscode == 402)
                        res.json({success:0, err_type: 3, err_msg:content});
                }
                else{
                    var sorted_content = SortUserList(content.userlist);
                    res.json({"success":1, "data":sorted_content, "privilegelevel": content.privilegelevel});
                    io.on("connection", function()
                    {
                        //broadcast to every users of this user"s join
                        io.emit("user joincommunity", username);
                    });
                }
            });
        }
    }

    AddUser (req,res){
        var info = req.body;
        var username = info["username"];
        var password = info["password"];
        var encry_password = md5(password);

        //validate username and password
        if(!Validate(username, password)) {
            res.json({success:0, err_type:4, err_msg: "username or password invalid"}); //username or password invalid
        }
        else {
          //add info into database
            dboper.AddDB(username, encry_password, url, function(statuscode, content){
                if(statuscode != 200){
                    if(statuscode == 400)
                        res.json({success:0, err_type: 1, err_msg:content});
                    else if(statuscode == 401)
                        res.json({success:0, err_type: 2, err_msg:content});
                    else if(statuscode == 402)
                        res.json({success:0, err_type: 3, err_msg:content});
                    else if(statuscode == 405)
                        res.json({success:0, err_type: 4, err_msg:content});
                }
                else {
                    var sorted_content = SortUserList(content);
                    res.json({"success":1, "data":sorted_content});
                    io.on("connection", function()
                    {
                        //broadcast to every users of this user"s join
                        io.emit("user joincommunity", username);
                    });
                }
            });
        }
    }

    ListUser (req, res){
        dboper.GetAllUsers(url, function(statuscode, content1, content2){
            if(statuscode != 200){
                res.json({success:0, err_type: 1, err_msg:content1});
            }
            else{
                var sorted_content1 = SortUserList(content1);
                var sorted_content2 = SortUserList(content2);
                dboper.GetAllUsernameAndEmergencyStatus(url, function (statuscode, user_status) {
                    if(statuscode == 200)
                        res.json({"success":1, "data1":sorted_content1, "data2":sorted_content2, "status":user_status});
                    else res.json({success:0, err_type: 1, err_msg:content1});
                });
            }
        });
    }

    Logout (req, res){
        var info = req.body;
        var username = info["username"];
        dboper.Logout(username, url, function(statuscode, content){
            if(statuscode != 200){
                res.json({success:0, err_type: 1, err_msg:content});
            }
            else{
                res.json({"success":1, "data": ""});
                io.on("connection", function()
                {
                    //broadcast to every users of this user"s join
                    io.emit("user leftcommunity", username);
                });
            }
        });
    }
    /*IfKeyWordExist(key_words, msg){
        for(var i = 0 ; i < key_words.length ; i++){
            if(msg != null && msg.includes(key_words[i]))
                return true;
        }
        return false;
    }*/

    SearchUserByName (req, res){
        var keywords = req.body;
        dboper.GetAllUsers(url, function(statuscode, content1, content2){
            if(statuscode != 200){
                res.json({success:0, err_type: 1, err_msg:content1});
            }
            else{
                var directory_search_result1 = [];
                var directory_search_result2 = [];
                for(var i = 0 ; i <= content1.length-1 ; i++){
                    var name1 = content1[i];
                    if(IfKeyWordExist(keywords, name1)){
                        directory_search_result1.push(content1[i]);
                    }
                }
                for(i = 0 ; i <= content2.length-1 ; i++){
                    var name2 = content2[i];
                    if(IfKeyWordExist(keywords, name2)){
                        directory_search_result2.push(content2[i]);
                    }
                }

                var sorted_content1 = SortUserList(directory_search_result1);
                var sorted_content2 = SortUserList(directory_search_result2);
                console.log("directory_search_result1" + directory_search_result1);
                console.log("search user by name" + sorted_content1);
                dboper.GetAllUsernameAndEmergencyStatus(url, function (statuscode, user_status) {
                    if(statuscode == 200)
                        res.json({"success":1, "data1":sorted_content1, "data2":sorted_content2, "status":user_status});
                    else res.json({success:0, err_type: 1, err_msg:content1});
                });
            }
        });
    }

    SearchUserByStatus (req, res){
        console.log("in controller");
        var keywords = req.body.value;

        console.log(keywords);

        dboper.GetAllUsers(url, function(statuscode, content1, content2){
            if(statuscode != 200){
                res.json({success:0, err_type: 1, err_msg:content1});
            }
            else{
              // var directory_search_result1 = [];
              // var directory_search_result2 = [];

                var sorted_content1 = SortUserList(content1);
                var sorted_content2 = SortUserList(content2);
                //console.log("directory_search_result1" + directory_search_result1);
                //console.log("search user by name" + sorted_content1);
                dboper.GetAllUsernameAndEmergencyStatus(url, function (statuscode, user_status) {
                    var directory_search_result1 = [];
                    var directory_search_result2 = [];
                    for(var i = 0 ; i <= sorted_content1.length-1 ; i++){

                        var name1 = sorted_content1[i];
                        if(user_status[name1] == keywords){
                            directory_search_result1.push(sorted_content1[i]);
                        }
                    }
                    for(i = 0 ; i <= sorted_content2.length-1 ; i++){
                        var name2 = sorted_content2[i];
                        if(user_status[name2] == keywords){
                            directory_search_result2.push(sorted_content2[i]);
                        }
                    }
                    if(statuscode == 200)
                        res.json({"success":1, "data1":directory_search_result1, "data2":directory_search_result2, "status":user_status});
                    else res.json({success:0, err_type: 1, err_msg:content1});
                });
            }
        });
    }
}

let jcc = new JoinCommunityController();

module.exports = {
    LoginCommunity: jcc.LoginCommunity,
    AddUser: jcc.AddUser,
    ListUser: jcc.ListUser,
    Logout: jcc.Logout,
    SearchUserByName: jcc.SearchUserByName,
    SearchUserByStatus: jcc.SearchUserByStatus
};
