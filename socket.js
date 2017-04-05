/**
 * Created by shuang on 4/5/17.
 */
'use strict';

var io = require('socket.io');
var JoinCommunityCtrl = require("./controller/JoinCommunityCtrl");
var PublicChatCtrl = require("./controller/PublicChatCtrl.js");
var PrivateChatCtrl = require("./controller/PrivateChatCtrl.js");
var PostAnnouncementCtrl = require("./controller/PostAnnouncementCtrl.js");
var ShareStatusCtrl = require("./controller/ShareStatusCtrl");
var ConnectedSockets = {};
var publicChat = require("./controller/PublicChatCtrl.js");
var privateChat = require("./controller/PrivateChatSocketCtrl");
function socketConnection(socket) {

    socket.on("Public Message", publicChat.publicMessageSocket(socket));

    socket.on("Post Announcement", PostAnnouncementCtrl.AnnouncementSocket(socket));
    socket.on("Update Share Status", ShareStatusCtrl.UpdateShareStatusSocket(socket)); //for directory updating status

    //when a private message is sent
    socket.on("Private Message", privateChat.privateMessageSocket(socket, ConnectedSockets));

    //when total number of unread(private+public) message is needed
    //socket.on("GetCount AllUnreadMsg", privateChat.getCount_AllUnreadMsg(socket));

    //when total number of private unread message is needed
    //socket.on("GetCount AllPrivateUnreadMsg", privateChat.getCount_AllPrivateUnreadMsg(socket));

    //when individual number of unread message is needed
    socket.on("GetCount IndividualUnreadMsg", privateChat.getCount_IndividualPrivateUnreadMsg(socket));

    //when individual latest msg of unread message is needed
    // socket.on("GetMsg IndividualLatestUnreadMsg", privateChat.get_IndividualPrivateUnreadMsg(socket));

    //set the private msg of sender and receiver to be read
    socket.on("PrivateMsgRead", privateChat.MarkedAsRead());

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
};


module.exports = function init(server) {
    io = io(server);
    io.sockets.on('connection', socketConnection);
    return io;
};