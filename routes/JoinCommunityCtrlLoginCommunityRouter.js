/**
 * Created by Ling on 2017/4/5.
 */
var express = require('express');
var router = express.Router();
var JoinCommunityCtrl = require("../controller/JoinCommunityCtrl.js");

/* GET users listing. */
router.post('/', JoinCommunityCtrl.LoginCommunity);

module.exports = router;