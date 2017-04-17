'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require('express');

var _WebhookController = require('../controllers/WebhookController');

var _WebhookController2 = _interopRequireDefault(_WebhookController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* jshint esversion: 6 */
var router = (0, _express.Router)();
var webhookController = new _WebhookController2.default();

router.route('/').get(webhookController.index);

router.route('/').post(webhookController.indexpost);

exports.default = router;