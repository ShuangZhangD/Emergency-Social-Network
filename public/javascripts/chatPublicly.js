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
        console.log(data);
        $scope.displaymsg.push(data);

    });
    $scope.postMsg = function() {
        //$scope.username = $window.localStorage.getItem("username");
        /*
        console.log($scope);
        console.log($scope.username);
        console.log($scope.logined);
        console.log($scope.showList.login);
        console.log($scope.showList);
        console.log($scope.test);
        console.log($scope.userClass);
        */
        $http({
            method:'post',
            url:'/public',
            data:{pubmsg:$scope.pubmsg, username:$scope.userClass['username'], timeStamp:Date.now(), emergencystatus:$scope.userClass['status']}
        }).success(function(rep){
            console.log(rep);
            var data = {pubmsg:$scope.pubmsg, username:$scope.userClass['username'], timestamp:Date.now(),emergencystatus:$scope.userClass['status']};
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

    var initialPublicSearchRes=function(){
        $scope.PublicSearchResult = [];
        $scope.public_search_results_suite = [];
        $scope.SearchPublicMsgMore = false;
    };
    initialPublicSearchRes();

    /** Check if one keyword of key_words exist in msg
     */
    var IfKeyWordExist=function(key_words, msg){
        for(var i = 0 ; i < key_words.length ; i++){
            if(msg != null && msg.includes(key_words[i]))
                return true;
        }
        return false;
    };

    $scope.searchPublicMsg = function() {
        $scope.PublicSearchResult = [];
        $scope.public_search_results_suite = [];
        $scope.SearchPublicMsgMore = false;

        //filter stop words
        var PublicSearchMsg = $scope.pubsearchmsg;
        var SearchKeys = PublicSearchMsg.split(" ");
        var stop_words = ["a","able","about","across","after","all","almost","also","am","among","an","and","any","are","as","at","be","because","been","but","by","can","cannot","could","dear","did","do","does","either","else","ever","every","for","from","get","got","had","has","have","he","her","hers","him","his","how","however","i","if","in","into","is","it","its","just","least","let","like",
            "likely","may","me","might","most","must","my","neither","no","nor","not","of","off","often","on","only","or","other","our","own","rather","said","say","says","she","should","since","so","some","than","that","the","their","them","then","there","these","they","this","tis","to","too","twas","us","wants","was","we","were","what","when","where","which","while","who"
            ,"whom","why","will","with","would","yet","you","your"];
        for(var i = 0; i < SearchKeys.length ; ){
            var index = stop_words.indexOf(SearchKeys[i]);
            if( index != -1){
                //it is a stop key, remove it
                SearchKeys.splice(i, 1)
            }else{
                i++;
            }
        }
        //if search keys is not empty, search it and get the result msg array suite
        if(SearchKeys.length > 0){

            console.log("Searching public msg, keys: "+SearchKeys);
            var public_search_results_suite = [];
            var public_search_results_set = [];
            var history_public_msg = $scope.displaymsg;
            console.log("History msg are: "+history_public_msg);
            var count = 0;

            for(var i = history_public_msg.length-1 ; i >= 0 ; i--){

                var pub_msg = history_public_msg[i].pubmsg;

                if(IfKeyWordExist(SearchKeys, pub_msg)){

                    public_search_results_set.push(history_public_msg[i]);

                    count++;

                    if(count % 10 == 0){
                        public_search_results_suite.push(public_search_results_set);
                        public_search_results_set = [];
                    }
                }
            }

            if(public_search_results_set.length > 0){
                public_search_results_suite.push(public_search_results_set);
            }

            //if results found, display them
            if(public_search_results_suite.length > 0){
                console.log("GET RESULTS ARE "+public_search_results_suite);
                $scope.PublicSearchResult = public_search_results_suite[0];
                public_search_results_suite.splice(0,1);
                $scope.public_search_results_suite = public_search_results_suite;

                if(public_search_results_suite.length>0){
                    $scope.SearchPublicMsgMore = true;
                }
            }

        }
        $scope.showList['publicSearchResult'] = true;
        $scope.pubsearchmsg="";
    };


    $scope.GetMorePublicSearchResults = function () {
        var more_results = $scope.public_search_results_suite[0];
        $scope.PublicSearchResult = $scope.PublicSearchResult.concat(more_results);

        $scope.public_search_results_suite.splice(0,1);

        if($scope.public_search_results_suite.length > 0){
            $scope.SearchPublicMsgMore = true;
        }else{
            $scope.SearchPublicMsgMore = false;
        }
    };
});
