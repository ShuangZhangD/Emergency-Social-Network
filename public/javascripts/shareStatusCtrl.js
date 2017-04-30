/***
 *
 * Share Status Use Case
 * Authors : Jerry and Komala (Pair Programming)
 *
 */

app.controller("shareStatusCtrl", function($window, $scope, $rootScope, $http, mySocket) {
    var shareStatus = function() {
        $http({
            method:"get",
            url:"/userstatus/" + $scope.userClass["username"],
            data: {username: $scope.userClass["username"]}
        }).success(function(rep){
            if(rep.data) {
                $scope.currentstatus=rep.data;
                $scope.userClass["status"] = $scope.currentstatus.emergencystatus;
            }
            else {
                $scope.currentstatus={emergencystatus:"Undefined"};
            }
        });
    };

	// Call this function after login
	// shareStatus();
    $rootScope.$on("loginGetShareStatus", function() {
        shareStatus();
    });

    mySocket.on("Update Share Status", function(data) {
        $rootScope.userChangedStatus(data);
    });

    $scope.setStatus = function(value) {
        var time = new Date();
        var msg_data = {
           private_msg : "Your contact " + $scope.userClass["username"] + " has updated the emergency status to " + value + ".",
           sender : "EmergencyAdmin",
           receiver : $scope.userClass["emergencycontact"],
           emergency_status : "Undefined",
           timestamp : time
        };
        $http({
            method:"post",
            url:"/userstatus",
            data: {username:$scope.userClass["username"], emergencystatus: value }
        }).success(function(rep) {
            mySocket.emit("Update Share Status", {username:$scope.userClass["username"], emergencystatus: value });
            mySocket.emit("Private Message", msg_data);
            if (rep.success == 1) {
                alert("Updated your status to " + value);
                $scope.currentstatus.emergencystatus = value;
                $scope.userClass["status"] = value;
            }
            else {
                console.log("Unexpected error in setting status");
                alert("Error in setting status");
            }
        });
    };
});
