var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");

var index = require("./routes/index");
var users = require("./routes/users");
var chatPubliclyRouter = require("./routes/chatPubliclyRouter");
var http = require("http");
var app = express();
// app.set("port", (process.env.PORT || 5000));
var server = http.createServer(app);
var io = require("socket.io").listen(server);
// var io;
server.listen(process.env.PORT || 5000);
var JoinCommunityCtrlLoginCommunityRouter = require("./routes/JoinCommunityCtrlLoginCommunityRouter");
var JoinCommunityCtrl = require("./controller/JoinCommunityCtrl");
var PublicChatCtrl = require("./controller/PublicChatCtrl.js");
var PrivateChatCtrl = require("./controller/PrivateChatCtrl.js");
var PostAnnouncementCtrl = require("./controller/PostAnnouncementCtrl.js");
var ShareStatusCtrl = require("./controller/ShareStatusCtrl");
// var sockets = require("./socket.js");
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "bower_components")));
app.use(express.static(path.join(__dirname, "node_modules")));


app.use("/", index);
app.use("/users", users);
app.use("/chatPublicly",chatPubliclyRouter);



app.use("/login", JoinCommunityCtrlLoginCommunityRouter);
app.post("/signup", JoinCommunityCtrl.AddUser);
app.get("/userlist", JoinCommunityCtrl.ListUser);
app.post("/logout", JoinCommunityCtrl.Logout);
app.post("/userlist/searchname", JoinCommunityCtrl.SearchUserByName);
app.post("/userlist/searchstatus", JoinCommunityCtrl.SearchUserByStatus);

app.get("/public", PublicChatCtrl.LoadPublicMessage);
app.post("/public", PublicChatCtrl.AddPublicMessage);
app.post("/publicchat/search", PublicChatCtrl.searchPublicMessages);

app.get("/announcement", PostAnnouncementCtrl.LoadAnnouncement);
app.post("/post_announcement", PostAnnouncementCtrl.AddAnnouncement);
app.post("/announcement/search", PostAnnouncementCtrl.searchPublicAnn);

app.post("/userstatus", ShareStatusCtrl.AddShareStatus);
app.get("/userstatus/:username", ShareStatusCtrl.GetShareStatus);

app.get("/privatechat/:sender/:receiver", PrivateChatCtrl.LoadPrivateHistoryMessage);
app.post("/privatechat", PrivateChatCtrl.AddPrivateMessage);
app.get("/privatechat/:receiver", PrivateChatCtrl.getCount_IndividualPrivateSender);
app.post("/privatechat/search/:user", PrivateChatCtrl.search);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});
// var server;


// exports.start = function(cb) {
//     server = app.listen(process.env.PORT || 5000, function() {
//         io = sockets(server);
//         if (cb) {
//             cb();
//         }
//     });
// };
//
// exports.close = function(cb) {
//     if (io) io.close();
//     if (server) server.close(cb);
// };
// // when app.js is launched directly
// if (module.id === require.main.id) {
//     exports.start();
// }
module.exports = app;
//
var ConnectedSockets = {};
var publicChat = require("./controller/PublicChatCtrl.js");
var privateChat2 = require("./controller/PrivateChatSocketCtrl");
io.on("connection", function(socket) {

    socket.on("Public Message", publicChat.publicMessageSocket(socket));

    socket.on("Post Announcement", PostAnnouncementCtrl.AnnouncementSocket(socket));
    socket.on("Update Share Status", ShareStatusCtrl.UpdateShareStatusSocket(socket)); //for directory updating status

    //when a private message is sent
    socket.on("Private Message", privateChat2.privateMessageSocket(socket, ConnectedSockets));

    //when total number of unread(private+public) message is needed
    //socket.on("GetCount AllUnreadMsg", privateChat.getCount_AllUnreadMsg(socket));

    //when total number of private unread message is needed
    //socket.on("GetCount AllPrivateUnreadMsg", privateChat.getCount_AllPrivateUnreadMsg(socket));

    //when individual number of unread message is needed
    socket.on("GetCount IndividualUnreadMsg", privateChat2.getCount_IndividualPrivateUnreadMsg(socket));

    //when individual latest msg of unread message is needed
   // socket.on("GetMsg IndividualLatestUnreadMsg", privateChat.get_IndividualPrivateUnreadMsg(socket));

    //set the private msg of sender and receiver to be read
    socket.on("PrivateMsgRead", privateChat2.MarkedAsRead());

    socket.on("userJoinCommunity", function(username){
        socket.broadcast.emit("userJoined",username);
        ConnectedSockets[username] = socket;
        //privateChat.UnreadCount(socket, username);
    });

    socket.on("left", function(username){
        socket.broadcast.emit("userleft");
        if(ConnectedSockets.hasOwnProperty(username)) {
            delete ConnectedSockets[username];
        }
    });
});

// module.exports = app;
