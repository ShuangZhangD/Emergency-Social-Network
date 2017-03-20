/**
 * Chat Privately Use Case
 * Authors: Jerry and Komala
 *
 */

app.controller('privateChatListCtrl', function ($window, $scope, $rootScope, $http, mySocket) {
	$scope.privateSenderList = []; // [{username:'komala', newMsgNum:3}, {username:'jerry', newMsgNum:0}]
	var getPrivateSenderList = function() {
        $http({
			method:'get',
			url:'/privatechat/' + $scope.userClass['username']  // TODO helen define this API
        }).success(function(rep){
				$scope.getPrivateSenderList = rep.data;
				$scope.userClass['newMsgNum'] = 0;
				for (var i = 0; i < $scope.getPrivateSenderList.length; i++) {
					var sender = $scope.getPrivateSenderList[i];
					$scope.userClass['newMsgNum'] += sender.count;
					if (sender.count == 0) {
						$scope.getPrivateSenderList[i].count = "";
					}
					console.log(sender);

				}
				if ($scope.userClass['newMsgNum'] != 0) {
					$scope.userClass['hasNewMsg'] = true;
				}
				else {
					 $scope.userClass['hasNewMsg'] = false;
				}

				console.log($scope.userClass['newMsgNum']);
		});
    };
	// Call this function after login
	//getPrivateSenderList();
	$rootScope.$on("loginGetPrivateChatList", function() {
		getPrivateSenderList();
	});
	// For Test
	$scope.privateSenderList = [{"sender":"helen","count":0},{"sender":"ivy","count":3}];

	// TODO socket.io
	$scope.openMsg = function (sender) {
		$scope.userClass['privateChatSender'] = sender;
		$rootScope.$emit('openPrivateChatContent');

			for (var item in $scope.showList) {
	            $scope.showList[item] = false;
	        }
			$scope.showList['privateChatContent'] = true;
	}
});
