/**
 * Chat Privately Use Case
 * Authors: Jerry and Komala
 *
 */

app.controller('privateChatListCtrl', function ($window, $scope, $rootScope, $http, mySocket) {
	$scope.privateSenderList = []; // [{username:'komala', newMsgNum:3}, {username:'jerry', newMsgNum:0}]


	$scope.updateNewMsgNum = function () {
		$scope.userClass['newMsgNum'] = 0;
		for (var i = 0; i < $scope.privateSenderList.length; i++) {
            var sender = $scope.getPrivateSenderList[i];
            if (sender.count != '') {
				$scope.userClass['newMsgNum'] += sender.count;
            }
			if (sender.count == 0) {
                $scope.getPrivateSenderList[i].count = "";
            }
        }
		if ($scope.userClass['newMsgNum'] != 0) {
            $scope.userClass['hasNewMsg'] = true;
        }
        else {
            $scope.userClass['hasNewMsg'] = false;
        }
	};

	$scope.updateNewMsgNumByData = function (data) {
		for (var i = 0; i < $scope.privateSenderList.length; i++) {
            if ($scope.getPrivateSenderList[i].sender == data.sender) {
				if ($scope.getPrivateSenderList[i].count == '') {
					$scope.getPrivateSenderList[i].count = 1;
				}
				else {
					$scope.getPrivateSenderList[i].count += 1;
				}
			}
        }
		$scope.updateNewMsgNum();
	};

	var getPrivateSenderList = function() {
        $http({
			method:'get',
			url:'/privatechat/' + $scope.userClass['username']  // TODO helen define this API
        }).success(function(rep){
			$scope.privateSenderList = rep.data;
			$scope.updateNewMsgNum();
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
	
	// Open Private Chat Content Page of a sender.
	$scope.openMsg = function (sender) {
		for (var i = 0; i < $scope.privateSenderList.length; i++) { 
			if ($scope.privateSenderList[i].sender == sender) {
				$scope.privateSenderList[i].count = 0;
			}
		}
		$scope.updateNewMsgNum();
		$scope.userClass['privateChatSender'] = sender;
		$rootScope.$emit('openPrivateChatContent');

		for (var item in $scope.showList) {
	        $scope.showList[item] = false;
        }
		$scope.showList['privateChatContent'] = true;
	}
});
