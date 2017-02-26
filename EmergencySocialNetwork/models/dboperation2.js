var user_class = require("../CreateDatabase.js")

exports.Login = function(username, password, callback) {
    MongoClient.connect('mongodb://127.0.0.1:27017/test', function (err, db) {
        if (err) {
            throw err;
        }
        else {
            // Initializing and creating a new user
            var collection = db.collection('users');
            let test_user = new user_class.User("1", username, password, "offline");
            test_user.displayUser(collection, function(result){
                    if(result.length == 0){
                    callback(401, "Username not Exist")//User not exist Error, to confirm registering
                }
                else{
                    test_user.CheckPassword(collection, function(pwdres){
                        if(pwdres.length==0){
                            //password incorrect
                            callback(402, "Password Incorrect")//Password Incorrect Error
                        }
                        else{
                            //password correct
                            callback(200, ["helen", "mike", "abel"])//Login successfully response
                        }
                    })
                }
            })
            //test_user.removeUser(collection);
            //test_user.createUser(collection);
            //test_user.displayUser(collection);

            // Initializing and creating a message
            //collection = db.collection('MESSAGES');
            //let test_message = new Message("1", "2", "Test message created during testing");
            //test_message.createMessage(collection);
            //test_message.displayMessage(collection);
            db.close();
        }
    });
}

exports.AddDB = function(username, password, callback){

}