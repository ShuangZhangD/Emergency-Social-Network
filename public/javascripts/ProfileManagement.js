app.controller("ProfileManagementCtrl", function($window, $scope, $rootScope, $http, mySocket) {
    var getProfileDetails = function() {
        $http({
            method:"get",
            url:"/profile/" + $scope.profile["profileusername"],
            //data: {username: $scope.userClass["username"]}
        }).success(function(rep){
            if(rep.data) {
                $scope.newusername = rep.data.newusername;
                $scope.newpassword = rep.data.newpassword;
                $scope.accountstatus = rep.data.accountstatus;
                $scope.privilegelevel = rep.data.privilegelevel;
                $scope.profile["profilepassword"] = rep.data.newpassword;
                $scope.profile["profileaccountstatus"] = rep.data.accountstatus;
                $scope.profile["profileprivilegelevel"] = rep.data.privilegelevel;

            }
            else {
                console.log("Error in retrieving data");
            }
        });
    };
    var updateName = function(params) {
        $http({
            method:"post",
            url:"/updatename",
            data: params
            //data: {username: $scope.userClass["username"]}
        }).success(function(rep){
            if (rep.success == 1) {
                mySocket.emit("Name Change", params);
                // $scope.newusername = rep.data.newusername;
                // $scope.newpassword = rep.data.newpassword;
                // $scope.accountstatus = rep.data.accountstatus;
                // $scope.privilegelevel = rep.data.privilegelevel;
                // $scope.profile["profilepassword"] = rep.data.newpassword;
                // $scope.profile["profileaccountstatus"] = rep.data.accountstatus;
                // $scope.profile["profileprivilegelevel"] = rep.data.privilegelevel;

            }
            else {
                console.log("Error in retrieving data");
            }
        });
    };

    var updateAccountStatus = function(params) {
        $http({
            method:"post",
            url:"/updateaccountstatus",
            data: params
            //data: {username: $scope.userClass["username"]}
        }).success(function(rep){
            if (rep.success == 1) {
                mySocket.emit("Accountstatus Change", params);
                // $scope.newusername = rep.data.newusername;
                // $scope.newpassword = rep.data.newpassword;
                // $scope.accountstatus = rep.data.accountstatus;
                // $scope.privilegelevel = rep.data.privilegelevel;
                // $scope.profile["profilepassword"] = rep.data.newpassword;
                // $scope.profile["profileaccountstatus"] = rep.data.accountstatus;
                // $scope.profile["profileprivilegelevel"] = rep.data.privilegelevel;

            }
            else {
                console.log("Error in retrieving data");
            }
        });
    };
    $rootScope.$on("openProfile", function() {
        console.log("In openprofile");
        for (var item in $scope.showList) {
            $scope.showList[item] = false;
        }
        getProfileDetails();
        console.log("setting profileManagement to true");
        $scope.showList["profileManagement"] = true;

    });

    $scope.updateProfileDetails = function() {

        console.log($scope.privilegelevel);
        var params = {
            profileusername:$scope.profile["profileusername"],
            newusername:$scope.newusername,
            profilepassword:$scope.profile["profilepassword"],
            newpassword:$scope.newpassword,
            accountstatus:$scope.accountstatus,
            privilegelevel:$scope.privilegelevel
        };

        $http({
            method:"post",
            url:"/profile",
            data: params
        }).success(function(rep) {
            if (rep.success == 1) {
                alert("Updated the profile!");
                if($scope.profile["profileusername"] != $scope.newusername){
                    updateName(params);
                }
                if($scope.profile["profilepassword"] != $scope.newpassword){
                    mySocket.emit("Password Change", params);
                }
                if($scope.profile["profileaccountstatus"] != $scope.accountstatus){
                    updateAccountStatus(params);
                }
                if($scope.profile["profileprivilegelevel"] != $scope.privilegelevel){
                    mySocket.emit("Privilegelevel Change", params);
                }
                $scope.profile["profileusername"] = $scope.newusername;
            }
            else {
                console.log("Error in updating profile");
                alert("Username already in use, please choose a different username.");
            }
        });
    };


});
