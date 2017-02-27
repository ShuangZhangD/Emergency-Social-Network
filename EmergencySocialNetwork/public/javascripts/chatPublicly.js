/**
 * Created by keqinli on 2/26/17.
 */

var app = angular.module('chatPubliclyAPP', []);
app.controller('chatPubliclyCtrl', function($scope, $http) {
    //$scope.name = "Runoob";
    $scope.postMsg = function() {
            $http({
                method:'post',
                url:'http://localhost:8081/public',
                data:{pubmsg:$scope.pubmsg, username:$scope.username}
            }).success(function(rep){
                console.log(rep);
                if (rep.success == 1) {
                    // post success
                    // TODO update in directory
                    alert('Post Msg Success!');
                    $scope.displaymsg=pubmsg; //add
                }
                else {
                    // login failed
                    if (rep.err_type == 1) {
                        // data base error
                    }
                    // else if (rep.err_type == 2) {
                    //     // Username not Exist
                    //     addUser($scope, $http);
                    // }
                    // else if (rep.err_type == 3) {
                    //     // Password Incorrect
                    // }
                    // else if (rep.err_type == 4) {
                    //     // username or password invalid
                    // }
                    else {
                        console.log("Unexpected");
                    }
                }
            }).error(function (rep) {
                console.log(rep);
            });

    };
    $scope.displaymsg=function(){
        $http({
            method:'get',
            url:'http://localhost:8081/retriveMsgs',
            //data:{pubmsg:$scope.pubmsg, username:$scope.username}
        }).success(function(rep){
            $scope.displaymsg=rep.data;
        });
    };
});
