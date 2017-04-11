'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require('express');

var _ChattingController = require('../controllers/ChattingController');

var _ChattingController2 = _interopRequireDefault(_ChattingController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* jshint esversion: 6 */
var router = (0, _express.Router)();
var chattingController = new _ChattingController2.default();

router.route('/').get(chattingController.index);

router.route('/send-message').post(chattingController.sendMessage);

exports.default = router;