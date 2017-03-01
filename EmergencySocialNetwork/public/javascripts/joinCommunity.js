app.controller('joinCommunityCtrl', function($window, $scope, $http) {
    //$scope.name = "Runoob";

    $scope.logined = false;
    $scope.login = function() {

        console.log($scope);
        if (check_usr($scope.username)) {
            var tmpUsername = $scope.username;
            $http({  
                method:'post',  
                url:'http://localhost:8081/login',  
                data:{username:$scope.username, password:$scope.password}  
            }).success(function(rep){  
                console.log(rep);  
                if (rep.success == 1) {
                    // login success
                    // TODO show directory
                    alert('Login success!');
                    //document.getElementById('login-container').hide();
                    //document.getElementById('directory-container').hide();
                    $scope.userClass['username'] = tmpUsername;
                    $scope.test = '456';
                    $scope.logined = true
                    $scope.showList.login = false;
                    //$window.localStorage.setItem("username", $scope.username);
                    displayDirectory($scope, $http)
                }
                else {
                    // login failed
                    if (rep.err_type == 1) {
                        // data base error
                    }
                    else if (rep.err_type == 2) {
                        // Username not Exist
                        addUser($scope, $http, tmpUsername);
                    }
                    else if (rep.err_type == 3) {
                        // Password Incorrect
                    }
                    else if (rep.err_type == 4) {
                        // username or password invalid
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
    }; // end of login
    $scope.logout = function () {
        if ($scope.logined) {
            $http({  
                method:'post',  
                url:'http://localhost:8081/logout',  
                data:{username:$scope.username}  
            }).success(function(rep){
                // logout
                console.log(rep);
                $scope.logined = false;
                $scope.directoryShow = false;
                $scope.loginShow = true;
            });
        }
        for (var item in $scope.showList) {
            $scope.showList[item] = false;
        }
        $scope.showList['login'] = true;

    };
    $scope.showPublicChat = function () {
        for (var item in $scope.showList) {
            $scope.showList[item] = false;
        }
        $scope.showList['chatPublicly'] = true;
    };
    $scope.showDirectory = function () {
        for (var item in $scope.showList) {
            $scope.showList[item] = false;
        }
        $scope.showList['directory'] = true;
    };
});

function addUser($scope, $http, tmpUsername) {
    var add = confirm("User does not exist, do you want to sign up?");
    if (add) {
        $http({  
            method:'post',  
            url:'http://localhost:8081/signup',  
            data:{username:$scope.username, password:$scope.password}  
        }).success(function(rep){  
            console.log(rep);  
            if (rep.success == 1) {
                // sign up success
                alert("Sign up success!");
                //document.getElementById('login-container').hide();
                //document.getElementById('directory-container').hide();
                $scope.userClass['username'] = tmpUsername;
                $scope.logined = true;
                $scope.showList.login = false;
                displayDirectory($scope, $http)
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
}

function check_usr(username){
    var b=/^[a-zA-Z\d]\w{2,10}[a-zA-Z\d]$/;
    if (!b.test(username)) {
        alert('Invalid Username');
        return false;
    }
    return true;
}

/*
    Komala write this function
*/
function displayDirectory($scope, $http) {
  $scope.showList.directory = true;
  $http({
    method:'get',
    url:'http://localhost:8081/userlist'
  }).then(function successCallback(response) {
    console.log(response);
    $scope.details = response.data.data;
    //$scope.details[$scope.details.length] = 'HK';
    //$scope.details = ['1', '2', '3'];
  }, function errorCallback(response) {
    console.log("Error in displaying the directory");
    console.log("response");
  });
}
