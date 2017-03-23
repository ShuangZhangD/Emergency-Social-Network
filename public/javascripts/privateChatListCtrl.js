/**
 * Chat Privately Use Case
 * Authors: Jerry and Komala
 *
 */

app.controller('privateChatListCtrl', function ($window, $scope, $rootScope, $http, mySocket) {
	$scope.privateSenderList = []; // [{username:'komala', newMsgNum:3}, {username:'jerry', newMsgNum:0}]


	$scope.updateNewMsgNum = function () {
		$scope.userClass['newMsgNum'] = 0;
		console.log($scope.privateSenderList);
        for (var i = 0; i < $scope.privateSenderList.length; i++) {
            var sender = $scope.privateSenderList[i];
            if (sender.count != '') {
				$scope.userClass['newMsgNum'] += sender.count;
            }
			if (sender.count == 0) {
                $scope.privateSenderList[i].count = "";
            }
        }
		if ($scope.userClass['newMsgNum'] != 0) {
            $scope.userClass['hasNewMsg'] = true;
        }
        else {
            $scope.userClass['hasNewMsg'] = false;
        }
        console.log($scope.privateSenderList);
        console.log($scope.userClass['newMsgNum']);
	};

	$rootScope.updateNewMsgNumByData = function (data) {
		var found = false;
		for (var i = 0; i < $scope.privateSenderList.length; i++) {
            if ($scope.privateSenderList[i].sender == data.sender) {
            	found = true;
				if ($scope.privateSenderList[i].count == '') {
					$scope.privateSenderList[i].count = 1;
				}
				else {
					$scope.privateSenderList[i].count += 1;
				}
			}
        }
        if (!found) {
            $scope.privateSenderList.push({sender: data.sender, count: 1});
		}
		$scope.updateNewMsgNum();
	};

	var getPrivateSenderList = function() {
        $http({
			method:'get',
			url:'/privatechat/' + $scope.userClass['username']  // TODO helen define this API
        }).success(function(rep){
			$scope.privateSenderList = rep.data;
			console.log($scope.privateSenderList);
			$scope.updateNewMsgNum();
		});
    };
	// Call this function after login
	//getPrivateSenderList();
	$rootScope.$on("loginGetPrivateChatList", function() {
		getPrivateSenderList();
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
		$scope.userClass['privateChatSender'] = sender;
		$rootScope.$emit('openPrivateChatContent');

		for (var item in $scope.showList) {
	        $scope.showList[item] = false;
        }
		$scope.showList['privateChatContent'] = true;
	}


	$rootScope.$on("openPrivateChat", function() {
		console.log($scope.userClass['privateChatSender']);
		$scope.openMsg($scope.userClass['privateChatSender'], true);
	});

});
