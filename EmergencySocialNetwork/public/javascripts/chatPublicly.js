/**
 * Created by keqinli on 2/26/17.
 */
'use strict';
var app = angular.module('chatPubliclyAPP', [ ]);
app.factory('mySocket', function ($rootScope){
    var socket = io();
    return {
        on: function(eventname, callback) {
            socket.on(eventname, function() {
                // arguments是函数内部的类数组对象
                var args = arguments;
                //手动执行 脏值检查
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
app.controller('chatPubliclyCtrl', function($scope, $http, mySocket) {
    //$scope.name = "Runoob";
    $scope.displaymsg = [];
     var getMessage=function(){
        $http({
            method:'get',
            url:'http://localhost:8081/public',
            //data:{pubmsg:$scope.pubmsg, username:$scope.username}
        }).success(function(rep){
            console.log(rep);
            console.log(rep.data);
            $scope.displaymsg = rep.data;
            alert('Get Msg Success!');
        });

    };
    getMessage();

    mySocket.on('messagereceive', function(data) {
        $scope.displaymsg.push(data);
    });

    $scope.postMsg = function() {
            var data = {pubmsg:$scope.pubmsg, username:"shuang", timestamp:Date.now()};
            $http({
                method:'post',
                url:'http://localhost:8081/public',
                data:{pubmsg:$scope.pubmsg, username:"shuang", timeStamp:Date.now()}
            }).success(function(rep){
                console.log(rep);

                 mySocket.emit('pubicmsg', data); //emit a data to every client

                $scope.displaymsg.push(data); //add
                $scope.pubmsg = "";
                if (rep.success == 1) {
                    // post success
                    // TODO update in directory
                    alert('Post Msg Success!');
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
