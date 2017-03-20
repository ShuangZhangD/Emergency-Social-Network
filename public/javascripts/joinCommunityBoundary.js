class joinCommunityBoundary {

    DisplayWelcomeMessage() {
        alert("Sign up success! You can use these status: OK:Green, Help:Yellow, Emergency:Red, Undefined.");
    };

    sendRegisterRequest ($scope, $http, tmpUsername, mySocket) {
        var add = confirm("User does not exist, do you want to sign up?");
        if (add) {
            $http({  
                method:'post',  
                url:'/signup',
                data:{username:$scope.username, password:$scope.password}  
            }).success(function(rep){  
                console.log(rep);  
                if (rep.success == 1) {
                    // sign up success
                    //document.getElementById('login-container').hide();
                    //document.getElementById('directory-container').hide();
                    //DisplayWelcomeMessage();
                    alert("Sign up success! You can use these status: OK:Green, Help:Yellow, Emergency:Red, Undefined.");
                    $scope.userClass['username'] = tmpUsername;
                    $scope.logined = true;
                    $scope.showList.login = false;
                    displayDirectory($scope, $http);
                    mySocket.emit("userJoinCommunity", tmpUsername);
                }
                else {
                    // sign up failed
                    if (rep.err_type == 1) {
                        // data base error
                    }
                    else if (rep.err_type == 4) {
                        // username or password invalid
                        alert("password invalid!");
                    }
                    else {
                        console.log("Unexpected");
                    }
                }
            }).error(function (rep) {
                console.log(rep);
            });
        }
        else {

        }
    };

};