/**
 * Chat Privately Use Case
 * Authors: Jerry and Komala
 *
 */

app.controller("privateChatContentCtrl", function ($window, $scope, $rootScope, $http, mySocket) {
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

    mySocket.on("receiver username changed", function (param) {
        var changed_part = param.profileusername;
        if(changed_part == $scope.userClass["privateChatSender"]){
            $rootScope.$emit("loginGetPrivateChatList");
            for (var item in $scope.showList) {
                $scope.showList[item] = false;
            }
            $scope.showList["privateChatList"] = true;
            $scope.showList["privateChatTable"] =true;

            $scope.userClass["privateChatSender"] = param.newusername;
            console.log("change username privatechatsender is "+$scope.userClass["privateChatSender"]);

            alert(param.profileusername+" has changed the username to "+param.newusername);
        }
    });

    mySocket.on("receiver Accountstatus changed", function (param) {
        var changed_part = param.profileusername;
        if(changed_part == $scope.userClass["privateChatSender"]){
            $rootScope.$emit("loginGetPrivateChatList");
            for (var item in $scope.showList) {
                $scope.showList[item] = false;
            }
            $scope.showList["privateChatList"] = true;
            $scope.showList["privateChatTable"] =true;

            alert(param.profileusername+" has changed the Accountstatus");
        }
    });
});
