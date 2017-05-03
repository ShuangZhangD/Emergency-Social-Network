var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");

var index = require("./routes/index");
var users = require("./routes/users");
var testmap = require("./routes/testmap");
var test_no_city_map = require("./routes/test_no_city_map");
var test_no_city_no_map = require("./routes/test_no_city_no_map");
var chatPubliclyRouter = require("./routes/chatPubliclyRouter");
var http = require("http");
var app = express();
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
var GroupChatCtrl = require("./controller/GroupChatCtrl.js");
var EmergencyShelterCtrl = require("./controller/EmergencyShelterCtrl.js");
var ProfileManagementCtrl = require("./controller/ProfileManagementCtrl.js");
var OwnProfileManagementCtrl = require("./controller/OwnProfileManagementCtrl.js");

// init data
EmergencyShelterCtrl.initData(function (args) {});

ProfileManagementCtrl.checkDefaultAdmin(function (args) {});

// var sockets = require("./socket.js");
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname+'/favicon.ico')));

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

app.use("/testmap", testmap);
app.use("/test_no_city_no_map", test_no_city_no_map);
app.use("/test_no_city_map", test_no_city_map);


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

app.get("/shelter_by_location/:latitude/:longitude", EmergencyShelterCtrl.getResultByLocation);
app.get("/shelter_search/:keywords", EmergencyShelterCtrl.search);
app.get("/groupchat", GroupChatCtrl.getAllGroupList);
app.get("/groupchat/:username", GroupChatCtrl.getMyGroupList);
app.post("/groupchat/join", GroupChatCtrl.joinGroup);
app.post("/groupchat/leave", GroupChatCtrl.leaveGroup);
app.post("/groupchat/create", GroupChatCtrl.createGroup);

app.get("/groupchat/message/:group", GroupChatCtrl.LoadGroupHistoryMessage);
app.post("/groupchat/message", GroupChatCtrl.AddGroupMessage);

app.get("/profile/:profileusername", ProfileManagementCtrl.getProfile);
app.post("/profile", ProfileManagementCtrl.updateProfile);
app.post("/updatename", ProfileManagementCtrl.updateName);
app.post("/updateaccountstatus", ProfileManagementCtrl.updateAccountStatus);

app.get("/ownprofile/:username", OwnProfileManagementCtrl.getOwnProfile);
app.post("/ownprofile", OwnProfileManagementCtrl.updateOwnProfile);

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
    socket.on("Group Message", GroupChatCtrl.groupMessageSocket(socket, ConnectedSockets));
    socket.on("Create Group", GroupChatCtrl.createGroupSocket(socket, ConnectedSockets));
    socket.on("Name Change", JoinCommunityCtrl.updateNameSocket(socket));
    socket.on("Password Change", JoinCommunityCtrl.updatePasswordSocket(socket));
    socket.on("Accountstatus Change", JoinCommunityCtrl.updateAccountstatusSocket(socket));
    socket.on("Privilegelevel Change", JoinCommunityCtrl.updatePrivilegelevelSocket(socket));


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

    });

    socket.on("left", function(username){
        socket.broadcast.emit("userleft");
        if(ConnectedSockets.hasOwnProperty(username)) {
            delete ConnectedSockets[username];
        }
    });

    socket.on("Name Change", privateChat2.ReceiverUsernameChange(socket));
    socket.on("Name Change", publicChat.changeUsernameSocket(socket));
    socket.on("Name Change", PostAnnouncementCtrl.changeUsernameSocket(socket));
    socket.on("Name Change", GroupChatCtrl.changeUsernameSocket(socket));

    socket.on("Accountstatus Change", privateChat2.ReceiverAccountstatusChange(socket));
    socket.on("Accountstatus Change", publicChat.changeAccountStatusSocket(socket));
    socket.on("Accountstatus Change", PostAnnouncementCtrl.changeAccountStatusSocket(socket));
    socket.on("Accountstatus Change", GroupChatCtrl.changeAccountStatusSocket(socket));

});


