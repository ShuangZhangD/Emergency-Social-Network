/***
 *
 * Share Status Use Case
 * Authors : Jerry and Komala (Pair Programming)
 *
 */

app.controller('shareStatusCtrl', function($window, $scope, $rootScope, $http, mySocket) {
    var shareStatus = function() {
        $http({
            method:'get',
            url:'/userstatus/' + $scope.userClass['username']
        }).success(function(rep){
        	console.log(rep);
			    $scope.currentstatus=rep.data;
        });
    };

	// Call this function after login 
	// shareStatus();
	$rootScope.$on("loginGetShareStatus", function() {
		shareStatus();
	});

	// For testing
	$scope.currentstatus="Okay";
	// Post function 
	// data: {username:$scope.userClass['username'], emergencystatus:$scope.userClass['status']}

});
