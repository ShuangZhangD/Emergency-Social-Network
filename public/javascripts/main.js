var app = angular.module('ESN-APP', []);
// to init variables in $scope
app.controller('initCtrl', function($scope, $http) {
    $scope.showList = {
        login : true,
        directory : false,
        chatPublicly : false,
		privateChatList : false,
    privateChatContent: false
    };
    $scope.userClass = {
		username:"",
		hasNewMsg:false,
		newMsgNum:0,
    privateChatSender: ""
	};
    $scope.logined = false;
    $scope.username = '';
    $scope.test = '123';

    console.log($scope);
});
