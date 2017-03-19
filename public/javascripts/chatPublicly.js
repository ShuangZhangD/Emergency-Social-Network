/**
 * Created by keqinli on 2/26/17.
 */

app.factory('mySocket', function($rootScope) {

    var socket = io();
    return {
        on: function(eventname, callback) {
            socket.on(eventname, function() {

                var args = arguments;
                $rootScope.$apply(function() {
                    callback.apply(socket, args);
                })
            });
        },
        emit: function(eventname, data, callback) {
            socket.emit(eventname, data, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
    }
});

app.controller('chatPubliclyCtrl', function($window, $scope, $http, mySocket) {
    //$scope.name = "Runoob";
    var getMessage=function(){
        $http({
            method:'get',
            url:'/public',
            //data:{pubmsg:$scope.pubmsg, username:$scope.username}
        }).success(function(rep){
            console.log(rep);
            $scope.displaymsg = rep.data;
            //alert('Get Msg Success!');
        });

    };
    getMessage();
    //$scope.displaymsg = [];
    mySocket.on('Public Message', function(data) {
        $scope.displaymsg.push(data);

    });
    $scope.postMsg = function() {
        //$scope.username = $window.localStorage.getItem("username");
        console.log($scope);
        console.log($scope.username);
        console.log($scope.logined);
        console.log($scope.showList.login);
        console.log($scope.showList);
        console.log($scope.test);
        console.log($scope.userClass);
        $http({
            method:'post',
            url:'/public',
            data:{pubmsg:$scope.pubmsg, username:$scope.userClass['username'], timeStamp:Date.now()}
        }).success(function(rep){
            console.log(rep);
            var data = {pubmsg:$scope.pubmsg, username:$scope.userClass['username'], timestamp:Date.now()};
            //$scope.displaymsg.push(data); //add
            mySocket.emit('Public Message', data);
            $scope.pubmsg = "";
            if (rep.success == 1) {
                // post success
                // TODO update in directory
                // alert('Post Msg Success!');
                console.log('Post Msg Success!');
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

});
