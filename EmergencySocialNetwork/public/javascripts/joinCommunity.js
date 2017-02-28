var app = angular.module('joinCommunityAPP', []);
app.controller('joinCommunityCtrl', function($scope, $http) {
    //$scope.name = "Runoob";
    $scope.loginShow = true;
    $scope.directoryShow = false;
    $scope.login = function() {
        if (check_usr($scope.username)) {
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
                    $scope.loginShow = false;
                    displayDirectory($scope, $http)
                }
                else {
                    // login failed
                    if (rep.err_type == 1) {
                        // data base error
                    }
                    else if (rep.err_type == 2) {
                        // Username not Exist
                        addUser($scope, $http);
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
    };
});

function addUser($scope, $http) {
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
  $scope.directoryShow = true;
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
