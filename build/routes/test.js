'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require('express');

var router = (0, _express.Router)(); /* jshint esversion: 6 */


router.param('id', function (req, res, next, id) {
	req.data = 'data: ' + id;
	next();
});
router.get('/:id', function (req, res, next) {
	res.send(req.data);
});

exports.default = router;