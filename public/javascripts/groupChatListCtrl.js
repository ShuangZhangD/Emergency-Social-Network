
app.controller("groupChatListCtrl", function ($window, $scope, $rootScope, $http, mySocket) {
    $scope.privateSenderList = [];
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
    $rootScope.$on("loginGetPrivateChatList", function() {
        getAllGroupList();
        getMyGroupList();
    });
    // For Test
    //$scope.privateSenderList = [{"sender":"helen","count":0},{"sender":"ivy","count":3}];

    // TODO socket.io
// Open Private Chat Content Page of a sender.
    $scope.openMsg = function (sender, isFromDirectory) {
        for (var i = 0; i < $scope.privateSenderList.length; i++) {
            if ($scope.privateSenderList[i].sender == sender) {
                $scope.userClass["newMsgOfSender"] = $scope.privateSenderList[i].count;
                $scope.privateSenderList[i].count = 0;
                if (isFromDirectory || $scope.userClass["newMsgOfSender"] == 0) {
                    $scope.userClass["displayHistory"] = true;
                }
                else {
                    $scope.userClass["displayHistory"] = false;
                }
            }
        }
        $scope.updateNewMsgNum();
        $scope.userClass["privateChatSender"] = sender;
        $rootScope.$emit("openPrivateChatContent");

        for (var item in $scope.showList) {
            $scope.showList[item] = false;
        }
        $scope.showList["privateChatContent"] = true;
    };

    $rootScope.$on("openPrivateChat", function() {
        $scope.openMsg($scope.userClass["privateChatSender"], true);
    });


    $scope.privateMsgs = [];
    $scope.newMsgs = [];
    var getPrivateMsgs = function() {
        $scope.privateMsgs = [];
        $scope.newMsgs = [];
        $http({
            method:"get",
            url:"/privatechat/" + $scope.userClass["privateChatSender"] + "/" + $scope.userClass["username"]  // TODO helen define this API
        }).success(function(rep) {
            $scope.privateMsgs = rep.data;
            $scope.newMsgs = [];
            if ($scope.userClass["newMsgOfSender"] > 0) {
                for (var i = $scope.userClass["newMsgOfSender"]; i > 0; i--) {
                    $scope.newMsgs.push($scope.privateMsgs[$scope.privateMsgs.length - i]);
                }
            }
        });
    };
    // Call this function after login
    //getPrivateSenderList();
    $rootScope.$on("openPrivateChatContent", function() {
        $scope.privateChatSender = $scope.userClass["privateChatSender"];
        getPrivateMsgs();
    });
    // For Test
    //$scope.privateMsgs = [{"sender":"a", "receiver": "b", "private_msg":"hello", "timestamp": 1111,"emergency_status": "OK"}];
    $scope.showHistoryMsg = function () {
        $scope.userClass["displayHistory"] = true;
    };

    $scope.postPrivateMsg = function () {
        var time = new Date();
        var msg_data = {
            PrivateMsg : $scope.private_msg,
            sender : $scope.userClass["username"],
            receiver : $scope.userClass["privateChatSender"],
            emergency_status : $scope.userClass["status"],
            timestamp : time
        };
        $http({
            method : "post",
            url : "/privatechat",
            data : msg_data
        }).success(function (rep) {
            // TODO socket.io
            if (rep.success == 1) {
                var msg_data_2 = {
                    sender : $scope.userClass["username"],
                    receiver : $scope.userClass["privateChatSender"],
                    private_msg : $scope.private_msg,
                    emergency_status : $scope.userClass["status"],
                    timestamp : time
                };
                $scope.private_msg = "";
                $scope.privateMsgs.push(msg_data_2);
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
