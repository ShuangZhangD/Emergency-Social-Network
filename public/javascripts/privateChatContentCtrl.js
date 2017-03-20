/**
 * Chat Privately Use Case
 * Authors: Jerry and Komala
 *
 */

app.controller('privateChatContentCtrl', function ($window, $scope, $rootScope, $http, mySocket) {
	$scope.privateMsgs = [];
	var getPrivateMsgs = function() {
        $http({
			method:'get',
			url:'/privatechat/' + $scope.userClass['privateChatSender'] + '/' + $scope.userClass['username']  // TODO helen define this API
        }).success(function(rep){
				$scope.privateMsgs = rep.data;
		});
    };
	// Call this function after login
	//getPrivateSenderList();
	$rootScope.$on("openPrivateChatContent", function() {
		getPrivateMsgs();
	});
	// For Test
	$scope.privateMsgs = [{"sender":"a", "receiver": "b", "private_msg":"hello", "timestamp": 1111,"emergency_status": "OK"}];

	$scope.postPrivateMsg = function () {
		var msg_data = {
			PrivateMsg : $scope.private_msg,
			sender : $scope.userClass['username'],
			receiver : $scope.userClass['privateChatSender']
		};
		$http({
			method : 'post',
			url : '/privatechat'
		}).success(function (rep) {
			// TODO socket.io
			
			if (rep.success == 1) {
				var msg_data_2 = {
					sender : $scope.userClass['username'],
					receiver : $scope.userClass['privateChatSender'],
					private_msg : $scope.private_msg,
					emergency_status : $scope.userClass['status']
				};
				$scope.private_msg = "";
				$scope.privateMsgs.push(msg_data_2);
				// socket.io
				mySocket.emit('Private Message', msg_data_2);
			}
			else {
				console.log("Unexpected error in post private msg.");
			}
		});
	};




	// TODO socket.io
	mySocket.on('PrivateChat', function(data) {
		if ($scope.showList.privateChatContent && $scope.userClass['privateChatSender'] == data.sender) {
			// in current page, just show it
			$scope.privateMsgs.push(data);
			mySocket.emit('PrivateMsgRead', {sender: data.sender, receiver: data.receiver});
		}
		else {
			// new msg, update all
			$scope.updateNewMsgNumByData();
		}
	});
});
