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
        	console.log("HI");
			console.log(rep.data);
			if(rep.data) {
				$scope.currentstatus=rep.data;
			}
			else {
				$scope.currentstatus="Undefined";
			}
        });
    };

	// Call this function after login 
	// shareStatus();
	$rootScope.$on("loginGetShareStatus", function() {
		shareStatus();
	});

	// For testing
	//$scope.currentstatus={emergencystatus:"Okay"};;
	// Post function 
	// data: {username:$scope.userClass['username'], emergencystatus:$scope.userClass['status']}

});
