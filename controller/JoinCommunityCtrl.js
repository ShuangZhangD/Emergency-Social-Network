var express = require('express');
var myParser = require("body-parser");
var dboper = require("../models/JoinCommunityDBoper.js");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var md5 = require('md5');
var reserved_usernames = ['about', 'access', 'account', 'accounts', 'add', 'address', 'adm', 'admin', 'administration', 'adult', 'advertising', 'affiliate', 'affiliates', 'ajax', 'analytics', 'android', 'anon', 'anonymous', 'api', 'app', 'apps', 'archive', 'atom', 'auth', 'authentication', 'avatar', 'backup', 'banner', 'banners', 'bin', 'billing', 'blog', 'blogs', 'board', 'bot', 'bots', 'business,', 'chat', 'cache', 'cadastro', 'calendar', 'campaign', 'careers', 'cgi', 'client', 'cliente', 'code', 'comercial', 'compare', 'config', 'connect', 'contact', 'contest', 'create', 'code', 'compras', 'css', 'dashboard', 'data', 'db', 'design', 'delete', 'demo', 'design', 'designer', 'dev', 'devel', 'dir', 'directory', 'doc', 'docs', 'domain', 'download', 'downloads', 'edit', 'editor', 'email', 'ecommerce', 'forum', 'forums', 'faq', 'favorite', 'feed', 'feedback', 'flog', 'follow', 'file', 'files', 'free', 'ftp', 'gadget', 'gadgets', 'games', 'guest', 'group', 'groups', 'help', 'home', 'homepage', 'host', 'hosting', 'hostname', 'html', 'http', 'httpd', 'https', 'hpg', 'info', 'information', 'image', 'img', 'images', 'imap', 'index', 'invite', 'intranet', 'indice', 'ipad', 'iphone', 'irc', 'java', 'javascript', 'job', 'jobs', 'js', 'knowledgebase', 'log', 'login', 'logs', 'logout', 'list', 'lists', 'mail', 'mail1', 'mail2', 'mail3', 'mail4', 'mail5', 'mailer', 'mailing', 'mx', 'manager', 'marketing', 'master', 'me', 'media', 'message', 'microblog', 'microblogs', 'mine', 'mp3', 'msg', 'msn', 'mysql', 'messenger', 'mob', 'mobile', 'movie', 'movies', 'music', 'musicas', 'my', 'name', 'named', 'net', 'network', 'new', 'news', 'newsletter', 'nick', 'nickname', 'notes', 'noticias', 'ns', 'ns1', 'ns2', 'ns3', 'ns4', 'old', 'online', 'operator', 'order', 'orders', 'page', 'pager', 'pages', 'panel', 'password', 'perl', 'pic', 'pics', 'photo', 'photos', 'photoalbum', 'php', 'plugin', 'plugins', 'pop', 'pop3', 'post', 'postmaster', 'postfix', 'posts', 'profile', 'project', 'projects', 'promo', 'pub', 'public', 'python', 'random', 'register', 'registration', 'root', 'ruby', 'rss', 'sale', 'sales', 'sample', 'samples', 'script', 'scripts', 'secure', 'send', 'service', 'shop', 'sql', 'signup', 'signin', 'search', 'security', 'settings', 'setting', 'setup', 'site', 'sites', 'sitemap', 'smtp', 'soporte', 'ssh', 'stage', 'staging', 'start', 'subscribe', 'subdomain', 'suporte', 'support', 'stat', 'static', 'stats', 'status', 'store', 'stores', 'system', 'tablet', 'tablets', 'tech', 'telnet', 'test', 'test1', 'test2', 'test3', 'teste', 'tests', 'theme', 'themes', 'tmp', 'todo', 'task', 'tasks', 'tools', 'tv', 'talk', 'update', 'upload', 'url', 'user', 'username', 'usuario', 'usage', 'vendas', 'video', 'videos', 'visitor', 'win', 'ww', 'www', 'www1', 'www2', 'www3', 'www4', 'www5', 'www6', 'www7', 'wwww', 'wws', 'wwws', 'web', 'webmail', 'website', 'websites', 'webmaster', 'workshop', 'xxx', 'xpg', 'you', 'yourname', 'yourusername', 'yoursite', 'yourdomain'];

var Validate = function(username, password){
  if( /\w{3,}/.test(username) && /\w{4,}/.test(password) )
  {
    for(i=0; i<reserved_usernames.length;i++) {
       if(username === reserved_usernames[i])
	  return false;
    }
    return true;
  } 
  else 
    return false;
}

var SortUserList = function(userlist)
//userlist should be an array of users
{
    return userlist.sort();
}

module.exports = {
  LoginCommunity: function (req, res) {
	var info = req.body;
	var username = info["username"];
	var password = info["password"];
  var encry_password = md5(password);

  //validate the username and password
  if(!Validate(username, password)) {
      res.json({success:0, err_type:4, err_msg: "username or password invalid"}); //username or password invalid
  }
  else {
    dboper.Login(username, encry_password, function(statuscode, content){
      if(statuscode != 200){
        if(statuscode == 400)
          res.json({success:0, err_type: 1, err_msg:content});
        else if(statuscode == 401)
            res.json({success:0, err_type: 2, err_msg:content});
        else if(statuscode == 402)
            res.json({success:0, err_type: 3, err_msg:content});
      }
      else{
        sorted_content = SortUserList(content);
          res.json({"success":1, "data":sorted_content});
          io.on('connection', function(socket)
          {
              //broadcast to every users of this user's join
              io.emit('user joincommunity', username);
          });
      }
    })
  }
},

  AddUser: function (req,res){
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
    dboper.AddDB(username, encry_password, function(statuscode, content){
      if(statuscode != 200){
          if(statuscode == 400)
              res.json({success:0, err_type: 1, err_msg:content});
          else if(statuscode == 401)
              res.json({success:0, err_type: 2, err_msg:content});
          else if(statuscode == 402)
              res.json({success:0, err_type: 3, err_msg:content});
      }
      else{
        sorted_content = SortUserList(content);
          res.json({"success":1, "data":sorted_content});
          io.on('connection', function(socket)
          {
              //broadcast to every users of this user's join
              io.emit('user joincommunity', username);
          });
      }
    })
  }
  },

  ListUser: function(req, res){
    dboper.GetAllUsers(function(statuscode, content1, content2){
      if(statuscode != 200){
        res.json({success:0, err_type: 1, err_msg:content});
      }
      else{
        sorted_content1 = SortUserList(content1);
          sorted_content2 = SortUserList(content2);
        res.json({"success":1, "data1":sorted_content1, "data2":sorted_content2});
      }
    })
  },

    Logout: function(req, res){
        var info = req.body;
        var username = info["username"];
        dboper.Logout(username, function(statuscode, content){
            if(statuscode != 200){
                res.json({success:0, err_type: 1, err_msg:content});
            }
            else{
                res.json({"success":1, "data": ""});
                io.on('connection', function(socket)
                {
                    //broadcast to every users of this user's join
                    io.emit('user leftcommunity', username);
                });
            }
        })
    }
}
