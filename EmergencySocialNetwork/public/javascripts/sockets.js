/**
 * Created by shuang on 2/28/17.
 */
var publicChat = require('../controller/PublicChatCtrl.js');


function socketConnection(socket) {

    socket.on('Public Message', publicChat.publicMessageSocket(socket));
}



module.exports = function init(server) {
    io.on('connection', socketConnection);
    return io;
};