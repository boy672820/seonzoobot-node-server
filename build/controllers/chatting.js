'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* jshint esversion: 6 */


var _net = require('net');

var _net2 = _interopRequireDefault(_net);

var _ChatScriptSocketConnection = require('../libraries/ChatScriptSocketConnection');

var _ChatScriptSocketConnection2 = _interopRequireDefault(_ChatScriptSocketConnection);

var _YoutubeApiConfiguration = require('../libraries/YoutubeApiConfiguration');

var _YoutubeApiConfiguration2 = _interopRequireDefault(_YoutubeApiConfiguration);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created at 2017-04-11
 */
var ChattingController = function () {
	function ChattingController() {
		_classCallCheck(this, ChattingController);
	}

	_createClass(ChattingController, [{
		key: 'index',


		/**
   * GET - Route index render
   */
		value: function index(req, res) {
			res.render('chatting', { title: 'Chatting' });
		}

		/**
   * POST - Sending created messages
   */

	}, {
		key: 'sendMessage',
		value: function sendMessage(req, res) {
			var csSocket = new _ChatScriptSocketConnection2.default(req.body.message);

			csSocket.data(function (data) {
				return data.toString();
			});

			csSocket.error(function (error) {
				res.send('죄송합니다. 서버에 오류가 발생했습니다. 관리자에게 문의해 주세요.');
			});

			csSocket.end(function (result) {
				var data = result.getData(),
				    sendJson = {};

				switch (data.split(' ')[0]) {
					case 'YOUTUBE-TRENDING':
						var count = Number(data.split('.')[1]);

						var youtube = new _YoutubeApiConfiguration2.default();
						youtube.videos.list({
							part: 'snippet',
							chart: 'mostPopular',
							regionCode: 'KR',
							maxResults: count
						}, function (error, data) {
							try {
								if (error) throw error;
								sendJson = {
									data: data.items[count - 1],
									type: 'youtube-api'
								};
							} catch (e) {
								sendJson = '유튜브 동영상을 가져오는 중 문제가 생겼습니다. 다시 시도해도 같은 문제가 발생할 경우 관리자에게 문의해 주세요.';
							}
						});
						break;

					default:
						sendJson = data;
				}

				res.send(sendJson);
			});
		}
	}]);

	return ChattingController;
}();

exports.default = ChattingController;