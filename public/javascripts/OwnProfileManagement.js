app.controller("OwnProfileManagementCtrl", function($window, $scope, $rootScope, $http, mySocket) {
    var getOwnProfileDetails = function() {
        $http({
            method:"get",
            url:"/ownprofile/" + $scope.userClass["username"],
            //data: {username: $scope.userClass["username"]}
        }).success(function(rep){
            if(rep.data) {
                $scope.firstname = rep.data.firstname;
                $scope.lastname = rep.data.lastname;
                $scope.email = rep.data.email;
                $scope.emergencycontact = rep.data.emergencycontact;
                $scope.contactemail = rep.data.contactemail;
                $scope.userClass["emergencycontact"] = rep.data.emergencycontact;
            }
            else {
                console.log("Error in retrieving data");
            }
        });
    };

    $rootScope.$on("loginGetProfile", function() {
        getOwnProfileDetails();
    });

    $scope.updateOwnProfileDetails = function() {
        var params = {
            username:$scope.userClass["username"],
            firstname:$scope.firstname,
            lastname:$scope.lastname,
            email:$scope.email,
            emergencycontact:$scope.emergencycontact,
            contactemail:$scope.contactemail
        };

        if ((($scope.email == undefined) || ($scope.email == "") || (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.com)+$/.test($scope.email))) && (($scope.contactemail == undefined) || ($scope.contactemail=="") || (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.com)+$/.test($scope.contactemail)))) {
            console.log("Valid emails");
        }
        else {
            alertify.alert("ESN","Invalid email format. The format should be of the form <sample@mail.com>.");
            return;
        }

        $scope.userClass["emergencycontact"] = $scope.emergencycontact;
        $http({
            method:"post",
            url:"/ownprofile",
            data: params
        }).success(function(rep) {
            if (rep.success == 1) {
                alertify.alert("ESN","Updated your profile!");
            }
            else {
                console.log("Unexpected error in updating profile");
                alertify.alert("ESN","Error in updating your profile, please try again.");
            }
        });
    };


});
