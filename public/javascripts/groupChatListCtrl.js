
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
        });
    };
    var getMyGroupList = function() {
        $http({
            method:"get",
            url:"/groupchat/" + $scope.userClass["username"]
        }).success(function(rep){
            $scope.myGroupList = rep.data;
        });
    };

    $scope.joinGroup = function(group) {
        var exist = {};
        for(var i = 0; i<$scope.myGroupList.length; i++){
            if($scope.myGroupList[i].group == group){
                exist = 1;
            }

        }
        if(exist !== 1){
            var add = confirm("Do you want to join the group?");
        if(add){
        var group_data = {
            group: group,
            username: $scope.userClass["username"],
        };
        $http({
            method:"post",
            url:"/groupchat/join",
            data: group_data
        }).success(function(rep) {
            if (rep.success == 1) {
                console.log("Join Group Success!");
                var group_data1 = {
                    group: group,
                };
                $scope.myGroupList.push(group_data1);
                alertify.alert("ESN","Successfully Join Group");
                $scope.allGroupTable = false;
                $scope.myGroupTable = true;
            }
            else {
                console.log("Unexpected error in join group");
            }
        });
        }else{
            console.log("Not join group");
        }
        }else{
           alertify.alert("ESN","Already in the group");
        }
    };

    $scope.leaveGroup = function(group) {
        var add = confirm("Do you want to leave the group?");
        if(add){
        var group_data = {
            group: group,
            username: $scope.userClass["username"],
        };
        $http({
            method:"post",
            url:"/groupchat/leave",
            data: group_data
        }).success(function(rep) {
            // mySocket.emit("Leave Group", group_data);
            if (rep.success == 1) {
                console.log("Leave Group Success!");
                getMyGroupList();
                alertify.alert("ESN","Successfully left the group.");
            }
            else {
                console.log("Unexpected error in leaving the group.");
            }
        });
        }else{
            console.log("Not leave group");
        }
    };

    $scope.createGroup = function() {

        var exist = 0;
        for(var i = 0; i<$scope.allGroupList.length; i++){
            if($scope.allGroupList[i] == $scope.newgroup){
                exist = 1;
            }
        }

        if($scope.newgroup == null){
            alertify.alert("ESN","Group name can not be empty!");
        }else if(exist == 1){
            alertify.alert("ESN","Group name already exist!");
        } else{
        var add = confirm("Do you want to create the group?");
        if(add){
        var group_data = {
            group: $scope.newgroup,
            username: $scope.userClass["username"],
        };
        console.log("+++++++++"+$scope.newgroup);
        $http({
            method:"post",
            url:"/groupchat/create",
            data: group_data
        }).success(function(rep) {
            if (rep.success == 1) {
                console.log("Create Group Success!");
                var group_data1 = {
                    group: $scope.newgroup,
                };
                mySocket.emit("Create Group", $scope.newgroup);
                $scope.myGroupList.push(group_data1);
                $scope.allGroupList.push($scope.newgroup);
                $scope.newgroup = "";
                alertify.alert("ESN","Successfully Created Group");
            }
            else {
                console.log("Unexpected error in create group");
            }
        });
        }else{
            console.log("Not create group");
        }
        }
    };
    // Call this function after login
    //getPrivateSenderList();
    $rootScope.$on("loginGetGroupList", function() {
        getAllGroupList();
        getMyGroupList();
        console.log("======"+$scope.myGroupList);
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


    $scope.postGroupMsg = function () {
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
                mySocket.emit("Group Message", msg_data_2);
            }
            else {
                console.log("Unexpected error in post group msg.");
            }
        });
    };

    // TODO socket.io
    mySocket.on("GroupChat", function(data) {
        if ($scope.showList.groupChatContent && $scope.userClass["groupChatSender"] == data.receiver) {
            $scope.groupMsgs.push(data);
        }
    });

    mySocket.on("Create Group", function(data) {
            $scope.allGroupList.push(data);
    });
});
