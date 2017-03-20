/**
 * Chat Privately Use Case
 * Authors: Jerry and Komala
 *
 */

app.controller('privateChatContentCtrl', function ($window, $scope, $rootScope, $http, mySocket) {
	$scope.privateMsgs = []; // [{username:'komala', newMsgNum:3}, {username:'jerry', newMsgNum:0}]
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
	//$scope.privateSenderList = [{"sender":"helen","count":0},{"sender":"ivy","count":3}];

	// TODO socket.io

});
