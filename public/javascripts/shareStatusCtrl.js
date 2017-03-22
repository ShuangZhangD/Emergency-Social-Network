/***
 *
 * Share Status Use Case
 * Authors : Jerry and Komala (Pair Programming)
 *
 */

app.controller('shareStatusCtrl', function($window, $scope, $rootScope, $http, mySocket) {
    var shareStatus = function() {
        console.log("############### Printing username in sharestatusctrl " + $scope.userClass['username']);
		$http({
            method:'get',
            url:'/userstatus/' + $scope.userClass['username'],
			data: {username: $scope.userClass['username']}
        }).success(function(rep){
        	console.log("Printing response in getsharestatus");
			//console.log(rep.data);
			console.log(rep.data.emergencystatus);

      // 	if(!$scope.currentstatus) {
			// 	$scope.currentstatus.emergencystatus = "Undefined";
			// }
			if(rep.data) {
				$scope.currentstatus=rep.data;
				console.log("inside if");
			}
			else {
				$scope.currentstatus={emergencystatus:"Undefined"};
				console.log("Inside else");
			}
        });
    };

	// Call this function after login
	// shareStatus();
	$rootScope.$on("loginGetShareStatus", function() {
		shareStatus();
	});

	// For testing
	//$scope.currentstatus="Test status";
	// Post function
	// data: {username:$scope.userClass['username'], emergencystatus:$scope.userClass['status']}

	$scope.setStatus = function(value) {
      console.log("setting status to ");
		console.log(value);
        $http({
            method:'post',
            url:'/userstatus',
            data: {username:$scope.userClass['username'], emergencystatus: value }
        }).success(function(rep) {
            if (rep.success == 1) {
                alert("Updated your status to " + value);
				        console.log('Updated the status!');
                $scope.currentstatus.emergencystatus = value;
            }
            else {
                // TODO error handling
                console.log("Unexpected error in setting status");
				        alert("Error in setting status");
            }
        });
    };

});
