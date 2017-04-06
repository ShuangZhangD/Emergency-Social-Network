/***
 *
 * Post Announcement Use Case
 *
 * Authors : Jerry and Komala (Pair Programing)
 * Date : March 15th, 2017
 *
 */

app.controller("postAnnouncementCtrl", function($window, $scope, $rootScope, $http, mySocket) {
    $scope.announcementList = [];
    // get all announcement from server while open this app page
    var getAnnouncement = function() {
        $http({
            method:"get",
            url:"/announcement"
        }).success(function(rep){
            $scope.announcementList = rep.data;
        });
    };
    // Call this function after login
    //getAnnouncement();
    $rootScope.$on("loginGetAnnouncement", function() {
        getAnnouncement();
    });
    // $scope.announcementList.push({announcement:"test", username:"j & k", timestamp:Date.now()});
    // receive a new announcement from server vie socket.io
    mySocket.on("Post Announcement", function(data) {
        $scope.announcementList.push(data);
		// TODO notification of new announcement
        if (data.username != $scope.userClass["username"]) {
            alert("New Announcement (" + data.username + ") : " + data.announcement);
        }
    });
    $scope.submitAnnouncement = function() {
        var announcement_data = {
            announcement: $scope.announcement_content,
            username: $scope.userClass["username"],
            timestamp: Date.now()
        };
        $http({
            method:"post",
            url:"/post_announcement",
            data: announcement_data
        }).success(function(rep) {
            mySocket.emit("Post Announcement", announcement_data);
            $scope.announcement_content = "";
            if (rep.success == 1) {
                console.log("Post Announcement Success!");
            }
            else {
                console.log("Unexpected error in post ann");
            }
        });
    };

    var initialAnnounceSearchRes=function(){
        $scope.AnnounceSearchResult = [];
        $scope.announce_search_results_suite = [];
        $scope.SearchAnnounceMore = false;
    };
    initialAnnounceSearchRes();

    /** Check if one keyword of key_words exist in msg

    var IfKeyWordExist=function(key_words, msg){
        for(var i = 0 ; i < key_words.length ; i++){
            if(msg != null && msg.includes(key_words[i]))
                return true;
        }
        return false;
    };*/

    $scope.searchAnnouncement = function() {
        $scope.AnnounceSearchResult = [];
        $scope.announce_search_results_suite = [];
        $scope.SearchAnnounceMore = false;

        //filter stop words
        var AnnounceSearchMsg = $scope.annsearchmsg;
        var SearchKeys = AnnounceSearchMsg.split(" ");
        var stop_words = ["a","able","about","across","after","all","almost","also","am","among","an","and","any","are","as","at","be","because","been","but","by","can","cannot","could","dear","did","do","does","either","else","ever","every","for","from","get","got","had","has","have","he","her","hers","him","his","how","however","i","if","in","into","is","it","its","just","least","let","like",
            "likely","may","me","might","most","must","my","neither","no","nor","not","of","off","often","on","only","or","other","our","own","rather","said","say","says","she","should","since","so","some","than","that","the","their","them","then","there","these","they","this","tis","to","too","twas","us","wants","was","we","were","what","when","where","which","while","who"
            ,"whom","why","will","with","would","yet","you","your"];
        for(var i = 0; i < SearchKeys.length ; ){
            var index = stop_words.indexOf(SearchKeys[i]);
            if( index != -1){
                //it is a stop key, remove it
                SearchKeys.splice(i, 1);
            } else{
                i++;
            }
        }
        //if search keys is not empty, search it and get the result msg array suite
         //if(SearchKeys.length > 0){
        $http({
            method : "post",
            url : "/announcement/search/",
            data: SearchKeys
        }).success(function(req){
            var announce_search_results_suite = [];
            var announce_search_results_set = [];
            var history_announce = req.data;
            var count = 0;
            if(history_announce.length === 0)
                alert("There are no matches");
            for( i = history_announce.length-1 ; i >= 0 ; i--){
                //var announcement = history_announce[i].announcement;
                //  if(IfKeyWordExist(SearchKeys, announcement)){
                announce_search_results_set.push(history_announce[i]);
                count++;
                if(count % 10 == 0){
                    announce_search_results_suite.push(announce_search_results_set);
                    announce_search_results_set = [];
                }
            }

            if(announce_search_results_set.length > 0){
                announce_search_results_suite.push(announce_search_results_set);
            }

            //if results found, display them
            if(announce_search_results_suite.length > 0){
                $scope.AnnounceSearchResult = announce_search_results_suite[0];
                announce_search_results_suite.splice(0,1);
                $scope.announce_search_results_suite = announce_search_results_suite;

                if(announce_search_results_suite.length>0){
                    $scope.SearchAnnounceMore = true;
                }
            }
        });
        $scope.showList["annoucementSearchResult"] = true;
        $scope.showList["announcementHistory"] = false;
        $scope.annsearchmsg="";
    };


    $scope.GetMoreSearchResults = function () {
        var more_results = $scope.announce_search_results_suite[0];
        $scope.AnnounceSearchResult = $scope.AnnounceSearchResult.concat(more_results);

        $scope.announce_search_results_suite.splice(0,1);

        if($scope.announce_search_results_suite.length > 0){
            $scope.SearchAnnounceMore = true;
        }else{
            $scope.SearchAnnounceMore = false;
        }
    };
});
