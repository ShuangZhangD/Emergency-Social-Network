/***
 *
 * Share Status Use Case
 * Authors : Jerry and Komala (Pair Programming)
 * Date : March 17th, 2017
 *
 */

app.controller('shareStatusCtrl', function($window, $scope, $http, mySocket) {
	var shareStatus = function() {
		$http({
			method:'post',
			url:'http://localhost:8081/status',
			data: {username:$scope.username, status:$scope.status}
		}).success(function(rep) {
			console.log(rep);
			if(rep.success) {
				$scope.status = rep.data;
			}
			else {
				console.log("Error on setting status");
			}
		});
	};
});


