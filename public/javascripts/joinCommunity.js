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
                    alert("Login success!");
                    $scope.userClass["username"] = tmpUsername;
                    $scope.test = "456";
                    $scope.logined = true;
                    $scope.showList.login = false;
                    displayDirectory($scope, $http);
                    //socket !!!
                    mySocket.emit("userJoinCommunity", tmpUsername);

                    // After logged in, get announcements, private chats, etc. (public chat seems ....)
                    $rootScope.$emit("loginGetAnnouncement");
                    $rootScope.$emit("loginGetPrivateChatList");
                    $rootScope.$emit("loginGetShareStatus");
                }
                else {
                    // login failed
                    if (rep.err_type == 1) {
                        console.log("Error in DB");
                    }
                    else if (rep.err_type == 2) {
                        // Username not Exist
                        addUser($scope, $rootScope, $http, tmpUsername,mySocket);
                    }
                    else if (rep.err_type == 3) {
                        // Password Incorrect
                        alert("Password is incorrect, please try again.");
                    }
                    else if (rep.err_type == 4) {
                        // username or password invalid
                        alert("Username or password is invalid. Username should start with an alphabet or number and must be atleast 3 characters long. Password should start with an alphabet or number and must be atleast 4 characters long. ");
                    }
                    else {
                        alert("Unexpected error, please try again.");
                    }
                }
            }).error(function (rep) {
                console.log(rep);
            });
        }
        else {
            alert("Username and password should not be empty or reserved keywords");

        }
    }; // end of login

    $scope.logout = function () {
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
    $scope.showPublicChat = function () {
        for (var item in $scope.showList) {
            $scope.showList[item] = false;
        }
        $scope.showList["chatPublicly"] = true;
        $scope.showList["publicSearchResult"] = false;
        $scope.showList["publicHistory"] = true;
    };

    $rootScope.userChangedStatus = function(data) {
        $scope.statusList[data.username] = data.emergencystatus;
    };

    $scope.showDirectory = function () {
        if ($scope.logined) {
            $http({
                method:"get",
                url:"/userlist"
            }).then(function successCallback(response) {
                $scope.details1 = response.data.data1;
                $scope.details2 = response.data.data2;
                $scope.statusList = response.data.status;
                $scope.historyList1 = $scope.details1;
                $scope.historyList2 = $scope.details2;
                $scope.historyStatus = $scope.statusList;
                console.log(response);
            }, function errorCallback(response) {
                console.log(response);
                console.log("Error in displaying the directory");
            });
        }
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
        // var history_detail1 = $scope.historyList1;
        // var history_detail2 = $scope.historyList2;
        // // console.log("History msg are: "+$scope.historyList1);
        // for(i = 0 ; i <= history_detail1.length-1 ; i++){
        //     var name1 = history_detail1[i];
        //     if(IfKeyWordExist(SearchKeys, name1)){
        //         directory_search_result1.push(history_detail1[i]);
        //     }
        // }
        // for(i = 0 ; i <= history_detail2.length-1 ; i++){
        //     var name2 = history_detail2[i];
        //     if(IfKeyWordExist(SearchKeys, name2)){
        //         directory_search_result2.push(history_detail2[i]);
        //     }
        // }
            console.log("In search");
            console.log(req.data1);
            if(req.data1.length ===0 && req.data2.length ===0)
                alert("There are no matches");
            $scope.details1 = req.data1;
            $scope.details2 = req.data2;

    // $scope.showList["annoucementSearchResult"] = true;
    // $scope.namesearchmsg="";
        });

    };

    /** Check if one keyword of key_words exist in msg

    var IfKeyWordExist=function(key_words, msg){
        for(var i = 0 ; i < key_words.length ; i++){
            if(msg != null && msg.includes(key_words[i]))
                return true;
        }
        return false;
    };*/

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
        //if search keys is not empty, search it and get the result msg array suite
        /*if(SearchKeys.length == 0) {
          alert("No results for search criteria.");
        }
        if(SearchKeys.length > 0){*/
        $http({
            method : "post",
            url : "/userlist/searchname/",
            data: SearchKeys
        }).success(function(req){
            // var history_detail1 = $scope.historyList1;
            // var history_detail2 = $scope.historyList2;
            // // console.log("History msg are: "+$scope.historyList1);
            // for(i = 0 ; i <= history_detail1.length-1 ; i++){
            //     var name1 = history_detail1[i];
            //     if(IfKeyWordExist(SearchKeys, name1)){
            //         directory_search_result1.push(history_detail1[i]);
            //     }
            // }
            // for(i = 0 ; i <= history_detail2.length-1 ; i++){
            //     var name2 = history_detail2[i];
            //     if(IfKeyWordExist(SearchKeys, name2)){
            //         directory_search_result2.push(history_detail2[i]);
            //     }
            // }
            console.log("In search");
            console.log(req.data1);
            if(req.data1.length ===0 && req.data2.length ===0)
                alert("There are no matches");
            $scope.details1 = req.data1;
            $scope.details2 = req.data2;

            // $scope.showList["annoucementSearchResult"] = true;
            $scope.namesearchmsg="";
        });
      //}
    };
    $scope.showAnnouncement = function () {
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

    mySocket.on("userJoined",function(username){
        if ($scope.logined) {
            $http({
                method: "get",
                url: "/userlist"
            }).then(function successCallback(response) {
                $scope.details1 = response.data.data1;
                $scope.details2 = response.data.data2;
                $scope.statusList = response.data.status;
                $scope.historyList1 = $scope.details1;
                $scope.historyList2 = $scope.details2;
                $scope.historyStatus = $scope.statusList;
                console.log(username);
            }, function errorCallback(response) {
                console.log(response);
                console.log("Error in displaying the directory");
            });
        }
    });

    mySocket.on("userleft",function(){
        if ($scope.logined) {
            $http({
                method: "get",
                url: "/userlist"
            }).then(function successCallback(response) {
                $scope.details1 = response.data.data1;
                $scope.details2 = response.data.data2;
                $scope.statusList = response.data.status;
                $scope.historyList1 = $scope.details1;
                $scope.historyList2 = $scope.details2;
                $scope.historyStatus = $scope.statusList;
            }, function errorCallback(response) {
                console.log(response);
                console.log("Error in displaying the directory");
            });
        }
    });
    mySocket.on("windowclose", function(){
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
    });

    // in directory, open private chat
    $scope.openPrivateChat = function (sender) {
        if (sender != $scope.userClass["username"]) {
            $scope.userClass["privateChatSender"] = sender;
            $rootScope.$emit("openPrivateChat");
        }
        else {
            alert("Only in WeChat you can chat with yourself! Not here!");
        }
    };
});

function addUser($scope, $rootScope, $http, tmpUsername, mySocket) {
    var add = confirm("User does not exist, do you want to sign up?");
    if (add) {
        $http({
            method:"post",
            url:"/signup",
            data:{username:$scope.username, password:$scope.password}
        }).success(function(rep){
            if (rep.success == 1) {
                // sign up success
                alert("Sign up success! You can use these status: OK:Green, Help:Yellow, Emergency:Red, Undefined.");
                $scope.userClass["username"] = tmpUsername;
                $scope.logined = true;
                $scope.showList.login = false;
                displayDirectory($scope, $http);
                mySocket.emit("userJoinCommunity", tmpUsername);
                // After logged in, get announcements, private chats, etc.
                $rootScope.$emit("loginGetAnnouncement");
                $rootScope.$emit("loginGetPrivateChatList");
                $rootScope.$emit("loginGetShareStatus");
            }
            else {
                // sign up failed
                if (rep.err_type == 1) {
                    // data base error
                }
                else if (rep.err_type == 4) {
                    // username or password invalid
                    alert("Password invalid!");
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
}

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

/*function check_pwd(password) {
    if (!password) {
        return false;
    }
    var b=/^[a-zA-Z\d]\w{4,18}[a-zA-Z\d]$/;
    if(!b.test(password)) {
        //alert("Invalid password. Password should start with an alphabet or number and must be atleast 4 characters long");
        return false;
    }
    return true;
}*/


/*
    Komala write this function
*/
function displayDirectory($scope, $http) {
    $scope.showList.directory = true;
    $http({
        method:"get",
        url:"/userlist"
    }).then(function successCallback(response) {
        $scope.details1 = response.data.data1;
        $scope.details2 = response.data.data2;
        $scope.statusList = response.data.status;
        $scope.historyList1 = $scope.details1;
        $scope.historyList2 = $scope.details2;
        $scope.historyStatus = $scope.statusList;
    }, function errorCallback(response) {
        console.log(response);
        console.log("Error in displaying the directory");
    });
}
