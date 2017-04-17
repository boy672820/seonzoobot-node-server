'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _chatting = require('./chatting');

var _chatting2 = _interopRequireDefault(_chatting);

var _webhook = require('./webhook');

var _webhook2 = _interopRequireDefault(_webhook);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = (0, _express.Router)();

/* GET home page. */
/* jshint esversion: 6 */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

/* Mount routes */
router.use('/chatting', _chatting2.default);
router.use('/webhook', _webhook2.default);

exports.default = router;