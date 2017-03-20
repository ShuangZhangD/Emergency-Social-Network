/***
 *
 * Share Status Use Case
 * Authors : Jerry and Komala (Pair Programming)
 *
 */

app.controller('shareStatusCtrl', function($window, $scope, $rootScope, $http, mySocket) {
    var shareStatus = function() {
        $http({
            method:'post',
            url:'/userstatus',
			data: {username:$scope.userClass['username'], emergencystatus:$scope.userClass['status']}
        }).success(function(rep){
        	console.log(rep);
			        

        });
    };
});

