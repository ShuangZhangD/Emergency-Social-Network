/***
 *
 * Post Announcement Use Case
 *
 * Authors : Jerry and Komala (Pair Programing)
 * Date : March 15th, 2017
 *
 */

app.controller('postAnnouncementCtrl', function($window, $scope, $rootScope, $http, mySocket) {
	$scope.announcementList = [];
    // get all announcement from server while open this app page
	var getAnnouncement = function() {
        $http({
			method:'get',
			url:'/announcement'
        }).success(function(rep){
				$scope.announcementList = rep.data;

		});
    };
	// Call this function after login
	//getAnnouncement();
	$rootScope.$on("loginGetAnnouncement", function() {
		getAnnouncement();
	});
	// $scope.announcementList.push({announcement:'test', username:'j & k', timestamp:Date.now()});
	// receive a new announcement from server vie socket.io
	mySocket.on('Post Announcement', function(data) {
		$scope.announcementList.push(data);
		// TODO notification of new announcement
        if (data.username != $scope.userClass["username"]) {
            alert("New Announcement (" + data.username + ") : " + data.announcement);
        }
	});
	$scope.submitAnnouncement = function() {
		var announcement_data = {
                announcement: $scope.announcement_content,
                username: $scope.userClass['username'],
                timestamp: Date.now()
        };
		console.log(announcement_data);

		$http({
			method:'post',
			url:'/post_announcement',
			data: announcement_data
		}).success(function(rep) {
            mySocket.emit('Post Announcement', announcement_data);
            $scope.announcement_content = "";
			if (rep.success == 1) {
				console.log('Post Announcement Success!');
			}
			else {
				// TODO error handling
				console.log("Unexpected error in post ann");
			}	
		});
	};
});
