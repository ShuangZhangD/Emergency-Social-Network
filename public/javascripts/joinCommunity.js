app.controller("joinCommunityCtrl", function($window, $scope, $rootScope, $http, mySocket) {
    $scope.statusList = {};
    $scope.logined = false;

    $scope.searchByStatus = function () {
        $scope.searchStatus = true;
        $scope.searchName = false;
    };
    $scope.searchByName = function () {
        $scope.searchStatus = false;
        $scope.searchName = true;
    };
    $scope.reset = function () {
        $scope.details1 = $scope.historyList1;
        $scope.details2 = $scope.historyList2;
    };
    var showDirectory = function () {
        if ($scope.logined) {
            $http({
                method:"get",
                url:"/userlist"
            }).then(function successCallback(response) {
                $scope.accountstatus = response.data.accountstatus;
                console.log("===here");
                console.dir(response.data.accountstatus);

                if($scope.userClass["privilegelevel"] == "Citizen" || $scope.userClass["privilegelevel"] == "Coordinator"){
                    var directory_account_result1 = [];
                    var directory_account_result2 = [];
                    for(var i = 0 ; i <= response.data.data1.length-1 ; i++){
                        var name1 = response.data.data1[i];
                        if($scope.accountstatus[name1] == "Active"){
                            console.log("online active+++++++++++"+directory_account_result1);

                            directory_account_result1.push(response.data.data1[i]);
                        }
                    }

                    for(i = 0 ; i <= response.data.data2.length-1 ; i++){
                        var name2 = response.data.data2[i];
                        if($scope.accountstatus[name2] == "Active"){
                            directory_account_result2.push(response.data.data2[i]);
                        }
                    }
                    console.log("online active"+directory_account_result1);

                    $scope.details1 = directory_account_result1;
                    $scope.details2 = directory_account_result2;
                    $scope.statusList = response.data.status;

                } else{
                    $scope.details1 = response.data.data1;
                    $scope.details2 = response.data.data2;
                    $scope.statusList = response.data.status;
                }


                $scope.historyList1 = $scope.details1;
                $scope.historyList2 = $scope.details2;
                $scope.historyStatus = $scope.statusList;
                $scope.historyaccountstatus = response.data.accountstatus;

                console.log(response);
            }, function errorCallback(response) {
                console.log(response);
                console.log("Error in displaying the directory");
            });
        }
    };
    var login_changestatus = function(tmpUsername){
        $scope.logined = true;
        $scope.showList.login = false;
        $scope.showList.directory = true;
        showDirectory();
        // displayDirectory($scope, $http);
        mySocket.emit("userJoinCommunity", tmpUsername);
        // After logged in, get announcements, private chats, etc.
        $rootScope.$emit("loginGetAnnouncement");
        $rootScope.$emit("loginGetPrivateChatList");
        $rootScope.$emit("loginGetShareStatus");
        $rootScope.$emit("loginGetGroupList");
        $rootScope.$emit("loginGetProfile");
    }
    var addUser = function(tmpUsername) {
        //var add=0;
        var add = confirm("User does not exist, do you want to sign up?");
        //add = alertify.confirm("ESN", 'User does not exist, do you want to sign up?', function(){ add = 1; }, function(){ add = 0;});
        if (add) {
            $http({
                method:"post",
                url:"/signup",
                data:{username:$scope.username, password:$scope.password}
            }).success(function(rep){
                if (rep.success == 1) {
                    // sign up success
                    alertify.alert("ESN","Sign up success! You can use these status: OK:Green, Help:Yellow, Emergency:Red, Undefined.");
                    $scope.userClass["username"] = tmpUsername;
                    login_changestatus(tmpUsername);

                }
                else {
                    // sign up failed
                    if (rep.err_type == 1) {
                        // data base error
                    }
                    else if (rep.err_type == 4) {
                        // username or password invalid
                        alertify.alert("ESN","Password invalid!");
                    }
                    else {
                        console.log("Unexpected");
                    }
                }
            }).error(function (rep) {
                console.log(rep);
            });
        }
        else {
            console.log("Unexpected error in joinCommunity.js");
        }
    };


    $scope.login = function() {
        if (check_usr($scope.username)) {
            // check_pwd($scope.password);
            var tmpUsername = $scope.username;
            $http({
                method:"post",
                url:"/login",
                data:{username:$scope.username, password:$scope.password || ""}
            }).success(function(rep){
                if (rep.success == 1) {
                    // login success
                    console.log(rep);
                    alertify.alert("ESN", "Login success! Welcome!");
                    $scope.userClass["username"] = tmpUsername;
                    $scope.userClass["privilegelevel"] = rep.privilegelevel;
                    $scope.test = "456";
                    login_changestatus(tmpUsername);
                }
                else {
                    // login failed
                    if (rep.err_type == 1) {
                        console.log("Error in DB");
                    }
                    else if (rep.err_type == 2) {
                        // Username not Exist
                        addUser(tmpUsername);
                        // addUser($scope, $rootScope, $http, tmpUsername,mySocket);
                    }
                    else if (rep.err_type == 3) {
                        // Password Incorrect
                        alertify.alert("ESN","Password is incorrect, please try again.");
                    }
                    else if (rep.err_type == 4) {
                        // username or password invalid
                        alertify.alert("ESN","Username or password is invalid. Username should start with an alphabet or number and must be atleast 3 characters long. Password should start with an alphabet or number and must be atleast 4 characters long. ");
                    }
                    else if (rep.err_type == 5) {
                        alertify.alert("ESN","This is a inactive user! Contact admin if you want to active it.");
                    }
                    else {
                        alertify.alert("ESN","Unexpected error, please try again.");
                    }
                }
            }).error(function (rep) {
                console.log(rep);
            });
        }
        else {
            alertify.alert("ESN","Username and password should not be empty or reserved keywords");
        }
    }; // end of login

    var logout = function () {
        if ($scope.logined) {
            $http({
                method:"post",
                url:"/logout",
                data:{username:$scope.username}
            }).success(function(rep){
                // logout
                console.log(rep);
                $scope.logined = false;
                $scope.directoryShow = false;
                $scope.loginShow = true;
            });
            mySocket.emit("left");
        }
        for (var item in $scope.showList) {
            $scope.showList[item] = false;
        }
        $scope.showList["login"] = true;

    };

    $scope.logout = function () {
        logout();
    };



    $scope.showPublicChat = function () {
        $rootScope.$emit("loginGetPublicChat");
        for (var item in $scope.showList) {
            $scope.showList[item] = false;
        }
        $scope.showList["chatPublicly"] = true;
        $scope.showList["publicSearchResult"] = false;
        $scope.showList["publicHistory"] = true;
    };

    $scope.showShelter = function () {
        for (var item in $scope.showList) {
            $scope.showList[item] = false;
        }
        $scope.showList["shelter"] = true;
        $rootScope.$emit("openMap");
    };

    $rootScope.userChangedStatus = function(data) {
        $scope.statusList[data.username] = data.emergencystatus;
    };


    $scope.showDirectory = function () {
        showDirectory();
        for (var item in $scope.showList) {
            $scope.showList[item] = false;
        }
        $scope.showList["directory"] = true;
        console.log("Debug-01");
    };



    $scope.getStatus = function (value) {
        console.log("value" + value);
        $http({
            method : "post",
            url : "/userlist/searchstatus/",
            data: {value:value}
        }).success(function(req){
            console.log(req.data1);
            if(req.data1.length ===0 && req.data2.length ===0)
                alertify.alert("ESN", "There are no matches");
            $scope.details2 = req.data2;
            $scope.details1 = req.data1;

        });

    };


    $scope.searchDirectory = function() {
        //var directory_search_result1 = [];
        //var directory_search_result2 = [];
        //filter stop words
        var DirectorySearchMsg = $scope.namesearchmsg;
        var SearchKeys = DirectorySearchMsg.split(" ");
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

        $http({
            method : "post",
            url : "/userlist/searchname/",
            data: SearchKeys
        }).success(function(response){

            console.log("In search");
            console.log(response.data1);

            console.log(response.data1);
            console.log(response.status);

            // console.log(response.accountstatus);
            if(response.data1.length ===0 && response.data2.length ===0)
                alertify.alert("ESN","There are no matches");



            if($scope.userClass["privilegelevel"] == "Citizen" || $scope.userClass["privilegelevel"] == "Coordinator"){
                var directory_account_result1 = [];
                var directory_account_result2 = [];
                for(var i = 0 ; i <= response.data1.length-1 ; i++){
                    var name1 = response.data1[i];
                    if($scope.accountstatus[name1] == "Active"){
                        console.log("online active+++++++++++"+directory_account_result1);

                        directory_account_result1.push(response.data1[i]);
                    }
                }

                for(i = 0 ; i <= response.data2.length-1 ; i++){
                    var name2 = response.data2[i];
                    if($scope.accountstatus[name2] == "Active"){
                        directory_account_result2.push(response.data2[i]);
                    }
                }
                console.log("online active"+directory_account_result1);
                if(directory_account_result1.length ===0 &&directory_account_result2.length === 0){
                    alertify.alert("ESN","There are no matches");
                }

                $scope.details1 = directory_account_result1;
                $scope.details2 = directory_account_result2;

            } else{
                $scope.details1 = response.data1;
                $scope.details2 = response.data2;
            }


            // $scope.showList["annoucementSearchResult"] = true;
            $scope.namesearchmsg="";
        });
      //}
    };
    $scope.showAnnouncement = function () {
        $rootScope.$emit("loginGetAnnouncement");
        for (var item in $scope.showList) {
            $scope.showList[item] = false;
        }
        $scope.showList["postAnnouncement"] = true;
        $scope.showList["announcementHistory"] = true;
        $scope.showList["annoucementSearchResult"] = false;
    };
    $scope.showPrivateChat = function () {
        $rootScope.$emit("loginGetPrivateChatList");
        for (var item in $scope.showList) {
            $scope.showList[item] = false;
        }
        $scope.showList["privateChatList"] = true;
        $scope.showList["privateChatTable"] =true;
    };
    $scope.showShareStatus = function() {
        for (var item in $scope.showList) {
            $scope.showList[item] = false;
        }
        $scope.showList["shareStatus"] = true;
    };

    $scope.showOwnProfile = function() {
        for (var item in $scope.showList) {
            $scope.showList[item] = false;
        }
        $scope.showList["ownProfileManagement"] = true;
    };

    $scope.showGroup = function() {
        for (var item in $scope.showList) {
            $scope.showList[item] = false;
        }
        $rootScope.$emit("loginGetGroupList");
        $scope.showList["groupList"] = true;
    };
    mySocket.on("userJoined",function(username){
        showDirectory();
    });

    mySocket.on("userleft",function(){
        showDirectory();
    });
    //maybe need to remove
    // mySocket.on("windowclose", function(){
    //     if ($scope.logined) {
    //         $http({
    //             method:"post",
    //             url:"/logout",
    //             data:{username:$scope.username}
    //         }).success(function(rep){
    //             // logout
    //             console.log(rep);
    //             $scope.logined = false;
    //             $scope.directoryShow = false;
    //             $scope.loginShow = true;
    //         });
    //         mySocket.emit("left");
    //     }
    //     for (var item in $scope.showList) {
    //         $scope.showList[item] = false;
    //     }
    //     $scope.showList["login"] = true;
    // });

    mySocket.on("Name Change", function(data) {
        if(data["profileusername"] == $scope.userClass["username"]){
            logout();
        }else{
            showDirectory();
        }
    });

    mySocket.on("Password Change", function(data) {
        if(data["profileusername"] == $scope.userClass["username"]){
            logout();
        }
    });

    mySocket.on("Accountstatus Change", function(data) {
        if(data["profileusername"] == $scope.userClass["username"]){
            logout();
        }else{
            showDirectory();
        }
    });

    mySocket.on("Privilegelevel Change", function(data) {
        if(data["profileusername"] == $scope.userClass["username"]){
            logout();
        }
    });


    // in directory, open private chat
    $scope.openPrivateChat = function (sender) {
        if (sender != $scope.userClass["username"]) {
            $scope.userClass["privateChatSender"] = sender;
            $rootScope.$emit("openPrivateChat");
        }
        else {
            alertify.alert("ESN","Only in WeChat you can chat with yourself! Not here!");
        }
    };

    $scope.showProfile = function (profileusername) {
        if (profileusername != $scope.userClass["username"]) {
            $scope.profile["profileusername"] = profileusername;
            $scope.profile["newusername"] = profileusername;
            $rootScope.$emit("openProfile");
        }
        else {
            alertify.alert("ESN","You cannot update your own data");
        }
    };
});

// function addUser($scope, $rootScope, $http, tmpUsername, mySocket) {
//     var add = confirm("User does not exist, do you want to sign up?");
//     if (add) {
//         $http({
//             method:"post",
//             url:"/signup",
//             data:{username:$scope.username, password:$scope.password}
//         }).success(function(rep){
//             if (rep.success == 1) {
//                 // sign up success
//                 alert("Sign up success! You can use these status: OK:Green, Help:Yellow, Emergency:Red, Undefined.");
//                 $scope.userClass["username"] = tmpUsername;
//                 $scope.logined = true;
//                 $scope.showList.login = false;
//                 $scope.showList.directory = true;
//                 showDirectory();
//                 // displayDirectory($scope, $http);
//                 mySocket.emit("userJoinCommunity", tmpUsername);
//                 // After logged in, get announcements, private chats, etc.
//                 $rootScope.$emit("loginGetAnnouncement");
//                 $rootScope.$emit("loginGetPrivateChatList");
//                 $rootScope.$emit("loginGetShareStatus");
//                 $rootScope.$emit("loginGetGroupList");
//             }
//             else {
//                 // sign up failed
//                 if (rep.err_type == 1) {
//                     // data base error
//                 }
//                 else if (rep.err_type == 4) {
//                     // username or password invalid
//                     alert("Password invalid!");
//                 }
//                 else {
//                     console.log("Unexpected");
//                 }
//             }
//         }).error(function (rep) {
//             console.log(rep);
//         });
//     }
//     else {
//         console.log("Unexpected error in joinCommunity.js");
//     }
// }

function check_usr(username){
    if(!username) {
        return false;
    }
    var b=/^[a-zA-Z\d]\w{1,18}[a-zA-Z\d]$/;
    var reserved_usernames = ["about", "access", "account", "accounts", "add", "address", "adm", "admin", "administration", "adult", "advertising", "affiliate", "affiliates", "ajax", "analytics", "android", "anon", "anonymous", "api", "app", "apps", "archive", "atom", "auth", "authentication", "avatar", "backup", "banner", "banners", "bin", "billing", "blog", "blogs", "board", "bot", "bots", "business,", "chat", "cache", "cadastro", "calendar", "campaign", "careers", "cgi", "client", "cliente", "code", "comercial", "compare", "config", "connect", "contact", "contest", "create", "code", "compras", "css", "dashboard", "data", "db", "design", "delete", "demo", "design", "designer", "dev", "devel", "dir", "directory", "doc", "docs", "domain", "download", "downloads", "edit", "editor", "email", "ecommerce", "forum", "forums", "faq", "favorite", "feed", "feedback", "flog", "follow", "file", "files", "free", "ftp", "gadget", "gadgets", "games", "guest", "group", "groups", "help", "home", "homepage", "host", "hosting", "hostname", "html", "http", "httpd", "https", "hpg", "info", "information", "image", "img", "images", "imap", "index", "invite", "intranet", "indice", "ipad", "iphone", "irc", "java", "javascript", "job", "jobs", "js", "knowledgebase", "log", "login", "logs", "logout", "list", "lists", "mail", "mail1", "mail2", "mail3", "mail4", "mail5", "mailer", "mailing", "mx", "manager", "marketing", "master", "me", "media", "message", "microblog", "microblogs", "mine", "mp3", "msg", "msn", "mysql", "messenger", "mob", "mobile", "movie", "movies", "music", "musicas", "my", "name", "named", "net", "network", "new", "news", "newsletter", "nick", "nickname", "notes", "noticias", "ns", "ns1", "ns2", "ns3", "ns4", "old", "online", "operator", "order", "orders", "page", "pager", "pages", "panel", "password", "perl", "pic", "pics", "photo", "photos", "photoalbum", "php", "plugin", "plugins", "pop", "pop3", "post", "postmaster", "postfix", "posts", "profile", "project", "projects", "promo", "pub", "public", "python", "random", "register", "registration", "root", "ruby", "rss", "sale", "sales", "sample", "samples", "script", "scripts", "secure", "send", "service", "shop", "sql", "signup", "signin", "search", "security", "settings", "setting", "setup", "site", "sites", "sitemap", "smtp", "soporte", "ssh", "stage", "staging", "start", "subscribe", "subdomain", "suporte", "support", "stat", "static", "stats", "status", "store", "stores", "system", "tablet", "tablets", "tech", "telnet", "test", "test1", "test2", "test3", "teste", "tests", "theme", "themes", "tmp", "todo", "task", "tasks", "tools", "tv", "talk", "update", "upload", "url", "user", "username", "usuario", "usage", "vendas", "video", "videos", "visitor", "win", "ww", "www", "www1", "www2", "www3", "www4", "www5", "www6", "www7", "wwww", "wws", "wwws", "web", "webmail", "website", "websites", "webmaster", "workshop", "xxx", "xpg", "you", "yourname", "yourusername", "yoursite", "yourdomain"];
    if (!b.test(username)) {
        //alert("Invalid Username. Username should start with an alphabet or number and must be atleast 3 characters long");
        return false;
    }
    for(var i=0; i<reserved_usernames.length;i++) {
        if(username === reserved_usernames[i]) {
            //alert("Invalid Username. Username should not be a reserved keyword");
            return false;
        }
    }
    return true;
}



/*
    Komala write this function
*/
// function displayDirectory($scope, $http) {
//     $scope.showList.directory = true;
//     $http({
//         method:"get",
//         url:"/userlist"
//     }).then(function successCallback(response) {
//         $scope.details1 = response.data.data1;
//         $scope.details2 = response.data.data2;
//         $scope.statusList = response.data.status;
//         $scope.historyList1 = $scope.details1;
//         $scope.historyList2 = $scope.details2;
//         $scope.historyStatus = $scope.statusList;
//     }, function errorCallback(response) {
//         console.log(response);
//         console.log("Error in displaying the directory");
//     });
// }
