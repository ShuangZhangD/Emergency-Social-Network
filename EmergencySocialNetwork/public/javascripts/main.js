var app = angular.module('ESN-APP', []);
// to init variables in $scope
app.controller('initCtrl', function($scope, $http) {
    $scope.showList = {
        login : true,
        directory : false,
        chatPublicly : false
    };

    console.log($scope);
});