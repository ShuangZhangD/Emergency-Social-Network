/**
 * Chat Privately Use Case
 * Authors: Jerry and Komala
 *
 */

app.controller('privateChatListCtrl', function ($window, $scope, $rootScope, $http, mySocket) {
	$scope.privateSenderList = []; // [{username:'komala', newMsgNum:3}, {username:'jerry', newMsgNum:0}]


	$scope.updateNewMsgNum = function () {
		$scope.userClass['newMsgNum'] = 0;
		console.log($scope.privateSenderList);
        for (var i = 0; i < $scope.privateSenderList.length; i++) {
            var sender = $scope.privateSenderList[i];
            if (sender.count != '') {
				$scope.userClass['newMsgNum'] += sender.count;
            }
			if (sender.count == 0) {
                $scope.privateSenderList[i].count = "";
            }
        }
		if ($scope.userClass['newMsgNum'] != 0) {
            $scope.userClass['hasNewMsg'] = true;
        }
        else {
            $scope.userClass['hasNewMsg'] = false;
        }
        console.log($scope.privateSenderList);
        console.log($scope.userClass['newMsgNum']);
	};

	$rootScope.updateNewMsgNumByData = function (data) {
		var found = false;
		for (var i = 0; i < $scope.privateSenderList.length; i++) {
            if ($scope.privateSenderList[i].sender == data.sender) {
            	found = true;
				if ($scope.privateSenderList[i].count == '') {
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
			method:'get',
			url:'/privatechat/' + $scope.userClass['username']  // TODO helen define this API
        }).success(function(rep){
			$scope.privateSenderList = rep.data;
			console.log($scope.privateSenderList);
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
		$scope.userClass['privateChatSender'] = sender;
		$rootScope.$emit('openPrivateChatContent');

		for (var item in $scope.showList) {
	        $scope.showList[item] = false;
        }
		$scope.showList['privateChatContent'] = true;
	}


	$rootScope.$on("openPrivateChat", function() {
		console.log($scope.userClass['privateChatSender']);
		$scope.openMsg($scope.userClass['privateChatSender'], true);
	});

	$scope.searchPrivateChat = function(){
        $scope.PrivateChatSearchResult = [];
        $scope.privatechat_search_results_suite = [];
        $scope.SearchPrivateChatMore = false;

        var PrivateChatSearch = $scope.privatechat_search_area;
        var SearchKeys = PrivateChatSearch.split(" ");
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
        if(SearchKeys.length > 0){
        	$http({
                method : 'post',
                url : '/privatechat/' +$scope.userClass['username'],
				data: SearchKeys
			}).success(function(req){
                console.log('search private chat success');
				var all_history_privatechat = req.data;  //data: [[],[],...]


			})
		}
	}

});
