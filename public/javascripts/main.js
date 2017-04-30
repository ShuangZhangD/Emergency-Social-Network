var app = angular.module("ESN-APP", ['ngSidebarJS']);
// to init variables in $scope
app.controller("initCtrl", function($scope, $http) {
    $scope.showList = {
        login : true,
        directory : false,
        chatPublicly : false,
        privateChatList : false,
        privateChatContent: false,
        shareStatus: false,
        shelter: false,
        publicSearchResult: false,
        annoucementSearchResult: false,
        privateChatSearchResult: false,
        privateChatTable: false,
        publicHistory: false,
        announcementHistory: false,
        groupList:false,
        groupChatContent:false,
        profileManagement:false
    };
    $scope.myGroupTable=false;
    $scope.allGroupTable=true;
    $scope.searchStatus = true;
    $scope.searchName =  false;
    $scope.userClass = {
        username:"",
        hasNewMsg:false,
        newMsgNum:0,
        privateChatSender: "",
        newMsgOfSender: 0,
        displayHistory: false,
        status: "TEST",
        privilegelevel: "Citizen",
        profileManagement: "false"
    };
    $scope.profile = {
        profileusername : "",
        profilepassword : "",
        profileaccountstatus : "",
        profileprivilegelevel : ""
    };
    $scope.logined = false;
    $scope.username = "";
    $scope.test = "123";
    $scope.historyList1 = [];
    $scope.historyList2 = [];
    $scope.historyStatus = [];
    $scope.historyaccountstatus = [];
    $scope.accountstatus = [];
    console.log($scope);
});
