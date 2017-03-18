/***
 *
 * Post Announcement Use Case
 *
 * Author : Jerry and Komala (Pair Programing)
 * Date : March 15th, 2017
 *
 */

app.controller('postAnnouncementCtrl', function($window, $scope, $http, mySocket) {
	$scope.announcementList = [];
    // get all announcement from server while open this app page
	var getAnnouncement = function() {
        $http({
			method:'get',
			url:'/announcement'
        }).success(function(rep){
			if (rep.success) {
				$scope.announcementList = rep.data;
			}
			else {
				console.log('Error on getting announcement');
			}
		});
    };
	getAnnouncement();
	$scope.announcementList.push({announcement:'test', username:'j & k', timestamp:Date.now()});
	// receive a new announcement from server vie socket.io
	mySocket.on('New Announcement', function(data) {
		$scope.announcementList.push(data);
		// TODO notification of new announcement
		alert(data);
	});
	$scope.submitAnnouncement = function() {
		var announcement_data = {
                announcement: $scope.announcement_content,
                usename: $scope.userClass['username'],
                timestamp: Date.now()
        };
		console.log(announcement_data);
		mySocket.emit('New Announcement', announcement_data);
		$http({
			method:'post',
			url:'/post_announcement',
			data: announcement_data
		}).success(function(rep) {
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
