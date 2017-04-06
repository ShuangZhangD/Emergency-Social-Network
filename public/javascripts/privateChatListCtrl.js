/**
 * Chat Privately Use Case
 * Authors: Jerry and Komala
 *
 */

app.controller("privateChatListCtrl", function ($window, $scope, $rootScope, $http, mySocket) {
    $scope.privateSenderList = [];
    $scope.updateNewMsgNum = function () {
        $scope.userClass["newMsgNum"] = 0;
        for (var i = 0; i < $scope.privateSenderList.length; i++) {
            var sender = $scope.privateSenderList[i];
            if (sender.count != "") {
                $scope.userClass["newMsgNum"] += sender.count;
            }
            if (sender.count == 0) {
                $scope.privateSenderList[i].count = "";
            }
        }
        if ($scope.userClass["newMsgNum"] != 0) {
            $scope.userClass["hasNewMsg"] = true;
        }
        else {
            $scope.userClass["hasNewMsg"] = false;
        }
    };

    $rootScope.updateNewMsgNumByData = function (data) {
        var found = false;
        for (var i = 0; i < $scope.privateSenderList.length; i++) {
            if ($scope.privateSenderList[i].sender == data.sender) {
                found = true;
                if ($scope.privateSenderList[i].count == "") {
                    $scope.privateSenderList[i].count = 1;
                }
                else {
                    $scope.privateSenderList[i].count += 1;
                }
            }
        }
        if (!found) {
            $scope.privateSenderList.push({sender: data.sender, count: 1});
        }
        $scope.updateNewMsgNum();
    };

    var getPrivateSenderList = function() {
        $http({
            method:"get",
            url:"/privatechat/" + $scope.userClass["username"]  // TODO helen define this API
        }).success(function(rep){
            $scope.privateSenderList = rep.data;
            $scope.updateNewMsgNum();
        });
    };
    // Call this function after login
    //getPrivateSenderList();
    $rootScope.$on("loginGetPrivateChatList", function() {
        getPrivateSenderList();
    });
    // For Test
    //$scope.privateSenderList = [{"sender":"helen","count":0},{"sender":"ivy","count":3}];

    // TODO socket.io

    // Open Private Chat Content Page of a sender.
    $scope.openMsg = function (sender, isFromDirectory) {
        for (var i = 0; i < $scope.privateSenderList.length; i++) {
            if ($scope.privateSenderList[i].sender == sender) {
                $scope.userClass["newMsgOfSender"] = $scope.privateSenderList[i].count;
                $scope.privateSenderList[i].count = 0;
                if (isFromDirectory || $scope.userClass["newMsgOfSender"] == 0) {
                    $scope.userClass["displayHistory"] = true;
                }
                else {
                    $scope.userClass["displayHistory"] = false;
                }
            }
        }
        $scope.updateNewMsgNum();
        $scope.userClass["privateChatSender"] = sender;
        $rootScope.$emit("openPrivateChatContent");

        for (var item in $scope.showList) {
            $scope.showList[item] = false;
        }
        $scope.showList["privateChatContent"] = true;
    };

    $rootScope.$on("openPrivateChat", function() {
        $scope.openMsg($scope.userClass["privateChatSender"], true);
    });

    $scope.searchPrivateChat = function(){
        $scope.privatechat_search_results = [];
        $scope.privatechat_search_results_suite = [];
        $scope.searchPrivateChatMore = false;

        var PrivateChatSearch = $scope.privatechat_search_area;
        var SearchKeys = PrivateChatSearch.split(" ");
        var stop_words = ["a","able","about","across","after","all","almost","also","am","among","an","and","any","are","as","at","be","because","been","but","by","can","cannot","could","dear","did","do","does","either","else","ever","every","for","from","get","got","had","has","have","he","her","hers","him","his","how","however","i","if","in","into","is","it","its","just","least","let","like",
            "likely","may","me","might","most","must","my","neither","no","nor","not","of","off","often","on","only","or","other","our","own","rather","said","say","says","she","should","since","so","some","than","that","the","their","them","then","there","these","they","this","tis","to","too","twas","us","wants","was","we","were","what","when","where","which","while","who"
            ,"whom","why","will","with","would","yet","you","your"];
        for(var i = 0; i < SearchKeys.length ; ){
            var index = stop_words.indexOf(SearchKeys[i]);
            if( index != -1){
                //it is a stop key, remove it
                SearchKeys.splice(i, 1);
            }else{
                i++;
            }
        }
        // if(SearchKeys.length > 0){
        $http({
            method : "post",
            url : "/privatechat/search/" +$scope.userClass["username"],
            data: SearchKeys
        }).success(function(req){
            var all_history_privatechat = req.data;  //data: [[],[],...]
            var history_privatechat_suite = [];
            var history_privatechat_set = [];
            var count = 0;
            if(all_history_privatechat.length === 0)
                alert("There are no matches");
            for(var i=all_history_privatechat.length-1; i>=0; i--){
                count++;
                history_privatechat_set.push(all_history_privatechat[i]);
                if(count % 10 ==0) {
                    history_privatechat_suite.push(history_privatechat_set);
                    history_privatechat_set = [];
                }
            }
            if(history_privatechat_set.length >0){
                history_privatechat_suite.push(history_privatechat_set);
                history_privatechat_set = [];
            }
            if(history_privatechat_suite.length >0){
                $scope.privatechat_search_results = history_privatechat_suite[0];
                history_privatechat_suite.splice(0,1);
                $scope.privatechat_search_results_suite =history_privatechat_suite;
                if(history_privatechat_suite.length > 0)
                    $scope.searchPrivateChatMore = true;
            }
        });
        // }
        $scope.showList["privateChatSearchResult"] = true;
        $scope.showList["privateChatTable"] =false;
        $scope.privatechat_search_area = "";
    };

    $scope.GetMoreSearchResults = function () {
        var more_results = $scope.privatechat_search_results_suite[0];
        $scope.privatechat_search_results = $scope.privatechat_search_results.concat(more_results);

        $scope.privatechat_search_results_suite.splice(0,1);

        if($scope.privatechat_search_results_suite.length > 0){
            $scope.searchPrivateChatMore = true;
        }else{
            $scope.searchPrivateChatMore = false;
        }
    };
});
