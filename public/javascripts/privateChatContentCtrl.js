/**
 * Chat Privately Use Case
 * Authors: Jerry and Komala
 *
 */

app.controller('privateChatContentCtrl', function ($window, $scope, $rootScope, $http, mySocket) {
	$scope.privateMsgs = [];
	$scope.newMsgs = [];
	var getPrivateMsgs = function() {
		console.log('getPrivateMsgs');
        $http({
			method:'get',
			url:'/privatechat/' + $scope.userClass['privateChatSender'] + '/' + $scope.userClass['username']  // TODO helen define this API
        }).success(function(rep){
			console.log('getPrivateMsgs success');
			console.log(rep);
				$scope.privateMsgs = rep.data;
			if ($scope.userClass['newMsgOfSender'] > 0) {
				for (var i = $scope.userClass['newMsgOfSender']; i > 0; i--) {
                    $scope.newMsgs.push($scope.privateMsgs[$scope.privateMsgs.length - i]);
				}
			}
		});
    };
	// Call this function after login
	//getPrivateSenderList();
	$rootScope.$on("openPrivateChatContent", function() {
		$scope.privateChatSender = $scope.userClass['privateChatSender'];
		console.log($scope.privateChatSender);
		getPrivateMsgs();
	});
	// For Test
	//$scope.privateMsgs = [{"sender":"a", "receiver": "b", "private_msg":"hello", "timestamp": 1111,"emergency_status": "OK"}];


    $scope.showHistoryMsg = function () {
		$scope.userClass["displayHistory"] = true;
    }
	
	
	$scope.postPrivateMsg = function () {
		var time = new Date();
		var msg_data = {
			PrivateMsg : $scope.private_msg,
			sender : $scope.userClass['username'],
			receiver : $scope.userClass['privateChatSender'],
            emergency_status : $scope.userClass['status'],
			timestamp : time
		};
		console.log(msg_data);
		$http({
			method : 'post',
			url : '/privatechat',
			data : msg_data
		}).success(function (rep) {
			// TODO socket.io
			
			if (rep.success == 1) {
				var msg_data_2 = {
					sender : $scope.userClass['username'],
					receiver : $scope.userClass['privateChatSender'],
					private_msg : $scope.private_msg,
					emergency_status : $scope.userClass['status'],
					timestamp : time
				};
				$scope.private_msg = "";
				$scope.privateMsgs.push(msg_data_2);
				// socket.io
				console.log(msg_data_2);
				mySocket.emit('Private Message', msg_data_2);
				console.log("end");
			}
			else {
				console.log("Unexpected error in post private msg.");
			}
		});
	};




	// TODO socket.io
	mySocket.on('PrivateChat', function(data) {
		console.log(data);
		if ($scope.showList.privateChatContent && $scope.userClass['privateChatSender'] == data.sender) {
			// in current page, just show it
			console.log('in the content page');
            $scope.privateMsgs.push(data);
            $scope.newMsgs.push(data);
			mySocket.emit('PrivateMsgRead', {sender: data.sender, receiver: data.receiver});
		}
		else {
			// new msg, update all
			console.log('update new msg num by data');
			$rootScope.updateNewMsgNumByData(data);
		}
	});
});
