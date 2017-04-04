var app = angular.module("ESN-APP", []);
// to init variables in $scope
app.controller("initCtrl", function($scope, $http) {
    $scope.showList = {
        login : true,
        directory : false,
        chatPublicly : false,
        privateChatList : false,
        privateChatContent: false,
        shareStatus: false,
        publicSearchResult: false,
        annoucementSearchResult: false,
        privateChatSearchResult: false,
        privateChatTable: false,
        publicHistory: false,
        announcementHistory: false
    };
    $scope.searchStatus = true;
    $scope.searchName =  false;
    $scope.userClass = {
        username:"",
        hasNewMsg:false,
        newMsgNum:0,
        privateChatSender: "",
        newMsgOfSender: 0,
        displayHistory: false,
        status: "TEST"
    };
    $scope.logined = false;
    $scope.username = "";
    $scope.test = "123";
    $scope.historyList1 = [];
    $scope.historyList2 = [];
    $scope.historyStatus = [];
    console.log($scope);
});
