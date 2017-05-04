app.controller("ProfileManagementCtrl", function($window, $scope, $rootScope, $http, mySocket) {
    var getProfileDetails = function() {
        $http({
            method:"get",
            url:"/profile/" + $scope.profile["profileusername"],
            //data: {username: $scope.userClass["username"]}
        }).success(function(rep){
            if(rep.data) {
                $scope.newusername = rep.data.newusername;
                $scope.newpassword = rep.data.newpassword;
                $scope.accountstatus = rep.data.accountstatus;
                $scope.privilegelevel = rep.data.privilegelevel;
                $scope.profile["profilepassword"] = rep.data.newpassword;
                $scope.profile["profileaccountstatus"] = rep.data.accountstatus;
                $scope.profile["profileprivilegelevel"] = rep.data.privilegelevel;
            }
            else {
                console.log("Error in retrieving data");
            }
        });
    };

    var updateName = function(params) {
        console.log("begin Name change!");

        $http({
            method:"post",
            url:"/updatename",
            data: params
            //data: {username: $scope.userClass["username"]}
        }).success(function(rep){
            if (rep.success == 1) {
                console.log("Name change success!");
                mySocket.emit("Name Change", params);
            }
            else {
                console.log("Error in retrieving data");
            }
        });
    };

    var updateAccountStatus = function(params) {
        $http({
            method:"post",
            url:"/updateaccountstatus",
            data: params
            //data: {username: $scope.userClass["username"]}
        }).success(function(rep){
            if (rep.success == 1) {
                mySocket.emit("Accountstatus Change", params);
            }
            else {
                console.log("Error in retrieving data");
            }
        });
    };
    $rootScope.$on("openProfile", function() {
        console.log("In openprofile");
        for (var item in $scope.showList) {
            $scope.showList[item] = false;
        }
        getProfileDetails();
        console.log("setting profileManagement to true");
        $scope.showList["profileManagement"] = true;

    });

    $scope.updateProfileDetails = function() {

        console.log($scope.privilegelevel);
        if(!check_usr($scope.newusername) || (($scope.newpassword!= $scope.profile["profilepassword"]) && (!check_pwd($scope.newpassword)))) {
            alertify.alert("ESN","Username or password not according to rules");
            return;
        }
        var params = {
            profileusername:$scope.profile["profileusername"],
            newusername:$scope.newusername,
            profilepassword:$scope.profile["profilepassword"],
            newpassword:$scope.newpassword,
            accountstatus:$scope.accountstatus,
            privilegelevel:$scope.privilegelevel
        };
        $http({
            method:"post",
            url:"/profile",
            data: params
        }).success(function(rep) {
            if (rep.success == 1) {
                alertify.alert("ESN","Updated the profile!");
                if($scope.profile["profileusername"] != $scope.newusername){
                    //alert("Updated Name!");
                    updateName(params);
                }
                if($scope.profile["profilepassword"] != $scope.newpassword){
                    mySocket.emit("Password Change", params);
                }
                console.log("888==="+$scope.profile["profileaccountstatus"]);
                console.log("999==="+$scope.accountstatus);
                if($scope.profile["profileaccountstatus"] != $scope.accountstatus){

                    updateAccountStatus(params);
                }
                if($scope.profile["profileprivilegelevel"] != $scope.privilegelevel){
                    mySocket.emit("Privilegelevel Change", params);
                }
                $scope.profile["profileusername"] = $scope.newusername;
                $scope.profile["profilepassword"] = $scope.newpassword;
                $scope.profile["profileaccountstatus"] = $scope.accountstatus;
                $scope.profile["profileprivilegelevel"] = $scope.privilegelevel;
            }
            else {
                console.log("Error in updating profile");
                console.log(rep);
                alertify.alert("ESN","Username already in use, please choose a different username.");
            }
        });
    };


});

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

function check_pwd(password) {
    if (!password) {
        return false;
    }
    var b=/^[a-zA-Z\d]\w{2,18}[a-zA-Z\d]$/;
    if(!b.test(password)) {
        //alert("Invalid password. Password should start with an alphabet or number and must be atleast 4 characters long");
        return false;
    }
    return true;
}
