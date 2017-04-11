'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _chatting = require('./chatting');

var _chatting2 = _interopRequireDefault(_chatting);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* jshint esversion: 6 */
var router = (0, _express.Router)();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

/* Mount routes */
router.use('/chatting', _chatting2.default);
//router.use( '/webhook' );

exports.default = router;