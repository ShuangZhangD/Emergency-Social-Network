app.controller('joinCommunityCtrl', function($window, $scope, $http, mySocket) {
    //$scope.name = "Runoob";

    $scope.logined = false;
    $scope.login = function() {

        console.log($scope);
        if (check_usr($scope.username) && check_pwd($scope.password)) {
            var tmpUsername = $scope.username;
            $http({  
                method:'post',  
                url:'http://localhost:8081/login',  
                data:{username:$scope.username, password:$scope.password}  
            }).success(function(rep){  
                console.log(rep);  
                if (rep.success == 1) {
                    // login success
                    // TODO show directory
                    alert('Login success!');
                    //document.getElementById('login-container').hide();
                    //document.getElementById('directory-container').hide();
                    $scope.userClass['username'] = tmpUsername;
                    $scope.test = '456';
                    $scope.logined = true
                    $scope.showList.login = false;
                    //$window.localStorage.setItem("username", $scope.username);
                    displayDirectory($scope, $http)
                    //socket !!!
                    mySocket.emit("userJoinCommunity", tmpUsername);
                }
                else {
                    // login failed
                    if (rep.err_type == 1) {
                        // data base error
                    }
                    else if (rep.err_type == 2) {
                        // Username not Exist
                        let boundary = new joinCommunityBoundary();
                        boundary.sendRegisterRequest($scope, $http, tmpUsername,mySocket);
                    }
                    else if (rep.err_type == 3) {
                        // Password Incorrect
                        alert("Password Incorrect!");
                    }
                    else if (rep.err_type == 4) {
                        // username or password invalid
                        alert("Invalid username or password!");
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

        }
    }; // end of login

    $scope.logout = function () {
        if ($scope.logined) {
            $http({  
                method:'post',  
                url:'http://localhost:8081/logout',  
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
        $scope.showList['login'] = true;

    };
    $scope.showPublicChat = function () {
        for (var item in $scope.showList) {
            $scope.showList[item] = false;
        }
        $scope.showList['chatPublicly'] = true;
    };
    $scope.showDirectory = function () {
        if ($scope.logined) {
            $http({
                method:'get',
                url:'http://localhost:8081/userlist'
            }).then(function successCallback(response) {
                console.log(response);
                $scope.details1 = response.data.data1;
                $scope.details2 = response.data.data2;
                //$scope.details[$scope.details.length] = 'HK';
                //$scope.details = ['1', '2', '3'];
            }, function errorCallback(response) {
                console.log("Error in displaying the directory");
                console.log("response");
            });
    }
        for (var item in $scope.showList) {
            $scope.showList[item] = false;
        }
        $scope.showList['directory'] = true;

    };
    mySocket.on("userJoined",function(username){
        if ($scope.logined) {
            $http({
                method: 'get',
                url: 'http://localhost:8081/userlist'
            }).then(function successCallback(response) {
                console.log(response);
                $scope.details1 = response.data.data1;
                $scope.details2 = response.data.data2;
                //$scope.details[$scope.details.length] = 'HK';
                //$scope.details = ['1', '2', '3'];
            }, function errorCallback(response) {
                console.log("Error in displaying the directory");
                console.log("response");
            });
        }
    });

    mySocket.on("userleft",function(){
        if ($scope.logined) {
                    $http({
                        method: 'get',
                        url: 'http://localhost:8081/userlist'
                    }).then(function successCallback(response) {
                        console.log(response);
                        $scope.details1 = response.data.data1;
                $scope.details2 = response.data.data2;
                //$scope.details[$scope.details.length] = 'HK';
                //$scope.details = ['1', '2', '3'];
            }, function errorCallback(response) {
                console.log("Error in displaying the directory");
                console.log("response");
            });
        }
    });
    mySocket.on("windowclose", function(){
        if ($scope.logined) {
            $http({
                method:'post',
                url:'http://localhost:8081/logout',
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
        $scope.showList['login'] = true;
    });
});



function check_usr(username){
    var b=/^[a-zA-Z\d]\w{1,18}[a-zA-Z\d]$/;
    var reserved_usernames = ['about', 'access', 'account', 'accounts', 'add', 'address', 
    'adm', 'admin', 'administration', 'adult', 'advertising', 'affiliate', 'affiliates', 
    'ajax', 'analytics', 'android', 'anon', 'anonymous', 'api', 'app', 'apps', 'archive', 
    'atom', 'auth', 'authentication', 'avatar', 'backup', 'banner', 'banners', 'bin', 
    'billing', 'blog', 'blogs', 'board', 'bot', 'bots', 'business,', 'chat', 'cache', 
    'cadastro', 'calendar', 'campaign', 'careers', 'cgi', 'client', 'cliente', 'code', 
    'comercial', 'compare', 'config', 'connect', 'contact', 'contest', 'create', 'code', 
    'compras', 'css', 'dashboard', 'data', 'db', 'design', 'delete', 'demo', 'design', 
    'designer', 'dev', 'devel', 'dir', 'directory', 'doc', 'docs', 'domain', 'download', 'downloads', 'edit', 'editor', 'email', 'ecommerce', 'forum', 'forums', 'faq', 'favorite', 'feed', 'feedback', 'flog', 'follow', 'file', 'files', 'free', 'ftp', 'gadget', 'gadgets', 'games', 'guest', 'group', 'groups', 'help', 'home', 'homepage', 'host', 'hosting', 'hostname', 'html', 'http', 'httpd', 'https', 'hpg', 'info', 'information', 'image', 'img', 'images', 'imap', 'index', 'invite', 'intranet', 'indice', 'ipad', 'iphone', 'irc', 'java', 'javascript', 'job', 'jobs', 'js', 'knowledgebase', 'log', 'login', 'logs', 'logout', 'list', 'lists', 'mail', 'mail1', 'mail2', 'mail3', 'mail4', 'mail5', 'mailer', 'mailing', 'mx', 'manager', 'marketing', 'master', 'me', 'media', 'message', 'microblog', 'microblogs', 'mine', 'mp3', 'msg', 'msn', 'mysql', 'messenger', 'mob', 'mobile', 'movie', 'movies', 'music', 'musicas', 'my', 'name', 'named', 'net', 'network', 'new', 'news', 'newsletter', 'nick', 'nickname', 'notes', 'noticias', 'ns', 'ns1', 'ns2', 'ns3', 'ns4', 'old', 'online', 'operator', 'order', 'orders', 'page', 'pager', 'pages', 'panel', 'password', 'perl', 'pic', 'pics', 'photo', 'photos', 'photoalbum', 'php', 'plugin', 'plugins', 'pop', 'pop3', 'post', 'postmaster', 'postfix', 'posts', 'profile', 'project', 'projects', 'promo', 'pub', 'public', 'python', 'random', 'register', 'registration', 'root', 'ruby', 'rss', 'sale', 'sales', 'sample', 'samples', 'script', 'scripts', 'secure', 'send', 'service', 'shop', 'sql', 'signup', 'signin', 'search', 'security', 'settings', 'setting', 'setup', 'site', 'sites', 'sitemap', 'smtp', 'soporte', 'ssh', 'stage', 'staging', 'start', 'subscribe', 'subdomain', 'suporte', 'support', 'stat', 'static', 'stats', 'status', 'store', 'stores', 'system', 'tablet', 'tablets', 'tech', 'telnet', 'test', 'test1', 'test2', 'test3', 'teste', 'tests', 'theme', 'themes', 'tmp', 'todo', 'task', 'tasks', 'tools', 'tv', 'talk', 'update', 'upload', 'url', 'user', 'username', 'usuario', 'usage', 'vendas', 'video', 'videos', 'visitor', 'win', 'ww', 'www', 'www1', 'www2', 'www3', 'www4', 'www5', 'www6', 'www7', 'wwww', 'wws', 'wwws', 'web', 'webmail', 'website', 'websites', 'webmaster', 'workshop', 'xxx', 'xpg', 'you', 'yourname', 'yourusername', 'yoursite', 'yourdomain'];
    if (!b.test(username)) {
        alert('Invalid Username. Username should start with an alphabet or number and must be atleast 3 characters long');
        return false;
    }
    for(i=0; i<reserved_usernames.length;i++) {
        if(username === reserved_usernames[i]) {
                alert('Invalid Username. Username should not be a reserved keyword');
                return false;
        }
    }
    return true;
}

function check_pwd(password) {
    var b=/^[a-zA-Z\d]\w{2,18}[a-zA-Z\d]$/;
    if(!b.test(password)) {
            alert('Invalid password. Password should start with an alphabet or number and must be atleast 4 characters long');
            return false;
    }
    return true;
}

/*
    Komala write this function
*/
function displayDirectory($scope, $http) {
  $scope.showList.directory = true;
  $http({
    method:'get',
    url:'http://localhost:8081/userlist'
  }).then(function successCallback(response) {
    console.log(response);
    $scope.details1 = response.data.data1;
      $scope.details2 = response.data.data2;
    //$scope.details[$scope.details.length] = 'HK';
    //$scope.details = ['1', '2', '3'];
  }, function errorCallback(response) {
    console.log("Error in displaying the directory");
    console.log("response");
  });
}
