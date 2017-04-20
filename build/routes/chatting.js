'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require('express');

var _chatting = require('../controllers/chatting');

var _chatting2 = _interopRequireDefault(_chatting);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* jshint esversion: 6 */
var chattingController = new _chatting2.default();

var router = (0, _express.Router)();

router.route('/').get(chattingController.index);

router.route('/send-message').post(chattingController.sendMessage);

exports.default = router;