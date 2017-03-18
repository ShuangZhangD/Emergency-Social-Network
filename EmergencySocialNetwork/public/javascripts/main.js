var app = angular.module('ESN-APP', []);
// to init variables in $scope
app.controller('initCtrl', function($scope, $http) {
    $scope.showList = {
        login : true,
        directory : false,
        chatPublicly : false,
	postAnnouncement : false
    };
    $scope.userClass = {username:""};
    $scope.logined = false;
    $scope.username = '';
    $scope.test = '123';

    console.log($scope);
});
