var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var chatPubliclyRouter = require('./routes/chatPubliclyRouter');
var http = require('http');
var app = express();
// app.set('port', (process.env.PORT || 5000));
var server = http.createServer(app);
var io = require('socket.io').listen(server);
server.listen(process.env.PORT || 5000);
var JoinCommunityCtrl = require('./controller/JoinCommunityCtrl.js');
var PublicChatCtrl = require('./controller/PublicChatCtrl.js');
var PrivateChatCtrl = require('./controller/PrivateChatCtrl.js');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(express.static(path.join(__dirname, 'node_modules')));


app.use('/', index);
app.use('/users', users);
app.use('/chatPublicly',chatPubliclyRouter);



app.post('/login', JoinCommunityCtrl.LoginCommunity);
app.post('/signup', JoinCommunityCtrl.AddUser);
app.get('/userlist', JoinCommunityCtrl.ListUser);
app.post('/logout', JoinCommunityCtrl.Logout);


app.get('/public', PublicChatCtrl.LoadPublicMessage);
app.post('/public', PublicChatCtrl.AddPublicMessage);

app.get('/privatechat/:sender/:receiver', PrivateChatCtrl.LoadPrivateHistoryMessage);
app.post('/privatechat', PrivateChatCtrl.AddPrivateMessage);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

var ConnectedSockets = {};
var publicChat = require('./controller/PublicChatCtrl.js');
var privateChat = require('./controller/PrivateChatCtrl.js');
io.on('connection', function(socket) {

    socket.on('Public Message', publicChat.publicMessageSocket(socket));

    //when a private message is sent
    socket.on('Private Message', privateChat.privateMessageSocket(socket, ConnectedSockets));

    //when total number of unread(private+public) message is needed
    socket.on('GetCount AllUnreadMsg', privateChat.getCount_AllUnreadMsg(socket));

    //when total number of private unread message is needed
    socket.on('GetCount AllPrivateUnreadMsg', privateChat.getCount_AllPrivateUnreadMsg(socket));

    //when individual number of unread message is needed
    socket.on('GetCount IndividualUnreadMsg', privateChat.getCount_IndividualPrivateUnreadMsg(socket));

    //when individual latest msg of unread message is needed
    socket.on('GetMsg IndividualLatestUnreadMsg', privateChat.get_IndividualPrivateUnreadMsg(socket));

    //set the private msg of sender and receiver to be read
    socket.on('PrivateMsgRead', privateChat.MarkedAsRead());

    socket.on('userJoinCommunity', function(username){
      socket.broadcast.emit("userJoined",username);
      ConnectedSockets[username] = socket;
      //privateChat.UnreadCount(socket, username);
    });

    socket.on('left', function(username){
      console.log("user left here!!!!");
        socket.broadcast.emit("userleft");
        if(ConnectedSockets.hasOwnProperty(username)) {
            delete ConnectedSockets[username]
        }
    });
    // socket.on("disconnect", function(){
    //   console.log("window close")
    //     socket.emit("windowclose");
    //     socket.broadcast.emit("userleft");
    // })
});





