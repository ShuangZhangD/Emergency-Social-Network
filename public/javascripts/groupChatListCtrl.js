
app.controller("groupChatListCtrl", function ($window, $scope, $rootScope, $http, mySocket) {

    $scope.allGroupList = [];
    $scope.myGroupList = [];

    $scope.showAllGroup = function () {
        $scope.allGroupTable = true;
        $scope.myGroupTable = false;
    };
    $scope.showMyGroup = function () {
        $scope.allGroupTable = false;
        $scope.myGroupTable = true;
    };
    var getAllGroupList = function() {
        $http({
            method:"get",
            url:"/groupchat"
        }).success(function(rep){
            $scope.allGroupList = rep.data;
            $scope.updateNewMsgNum();
        });
    };
    var getMyGroupList = function() {
        $http({
            method:"get",
            url:"/groupchat/" + $scope.userClass["username"]
        }).success(function(rep){
            $scope.myGroupList = rep.data;
            $scope.updateNewMsgNum();
        });
    };

    $scope.joinGroup = function(group) {
        var group_data = {
            group: group,
            username: $scope.userClass["username"],
        };
        $http({
            method:"post",
            url:"/group/join",
            data: group_data
        }).success(function(rep) {
            mySocket.emit("Join Group", group_data);
            if (rep.success == 1) {
                console.log("Post Announcement Success!");
            }
            else {
                console.log("Unexpected error in post ann");
            }
        });
    };

    $scope.leaveGroup = function(group) {
        var group_data = {
            group: group,
            username: $scope.userClass["username"],
        };
        $http({
            method:"post",
            url:"/group/leave",
            data: group_data
        }).success(function(rep) {
            mySocket.emit("Leave Group", group_data);
            if (rep.success == 1) {
                console.log("Post Announcement Success!");
            }
            else {
                console.log("Unexpected error in post ann");
            }
        });
    };

    $scope.createGroup = function() {
        var group_data = {
            group: $scope.newgroup,
            username: $scope.userClass["username"],
        };
        $http({
            method:"post",
            url:"/group/create",
            data: group_data
        }).success(function(rep) {
            mySocket.emit("Create Group", group_data);
            if (rep.success == 1) {
                console.log("Post Announcement Success!");
            }
            else {
                console.log("Unexpected error in post ann");
            }
        });
    };
    // Call this function after login
    //getPrivateSenderList();
    $rootScope.$on("loginGetGroupList", function() {
        getAllGroupList();
        getMyGroupList();
    });
    // For Test
    //$scope.privateSenderList = [{"sender":"helen","count":0},{"sender":"ivy","count":3}];

    // TODO socket.io
// Open Private Chat Content Page of a sender.
    $scope.openMsg = function (group) {

        $scope.userClass["groupChatSender"] = group;
        $rootScope.$emit("openGroupChatContent");

        for (var item in $scope.showList) {
            $scope.showList[item] = false;
        }
        $scope.showList["groupChatContent"] = true;
    };


    $scope.groupMsgs = [];
    var getGroupMsgs = function() {
        $scope.groupMsgs = [];
        $http({
            method:"get",
            url:"/groupchat/message/" + $scope.userClass["groupChatSender"]
        }).success(function(rep) {
            $scope.groupMsgs = rep.data;
        });
    };
    // Call this function after login
    //getPrivateSenderList();
    $rootScope.$on("openGroupChatContent", function() {
        $scope.groupChatSender = $scope.userClass["groupChatSender"];
        getGroupMsgs();
    });
    // For Test


    $scope.postPrivateMsg = function () {
        var time = new Date();
        var msg_data = {
            groupMsg : $scope.group_msg,
            sender : $scope.userClass["username"],
            receiver : $scope.groupChatSender,
            emergency_status : $scope.userClass["status"],
            timestamp : time
        };
        $http({
            method : "post",
            url : "/groupchat/message",
            data : msg_data
        }).success(function (rep) {
            // TODO socket.io
            if (rep.success == 1) {
                var msg_data_2 = {
                    sender : $scope.userClass["username"],
                    receiver : $scope.groupChatSender,
                    group_msg : $scope.group_msg,
                    emergency_status : $scope.userClass["status"],
                    timestamp : time
                };
                $scope.group_msg = "";
                $scope.groupMsgs.push(msg_data_2);
                // socket.io
                mySocket.emit("Private Message", msg_data_2);
            }
            else {
                console.log("Unexpected error in post private msg.");
            }
        });
    };

    // TODO socket.io
    mySocket.on("PrivateChat", function(data) {
        if ($scope.showList.privateChatContent && $scope.userClass["privateChatSender"] == data.sender) {
            $scope.privateMsgs.push(data);
            $scope.newMsgs.push(data);
            mySocket.emit("PrivateMsgRead", {sender: data.sender, receiver: data.receiver});
        }
        else {
            $rootScope.updateNewMsgNumByData(data);
        }
    });

});
