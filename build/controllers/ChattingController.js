'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* jshint esversion: 6 */


var _net = require('net');

var _net2 = _interopRequireDefault(_net);

var _youtubeApi = require('youtube-api');

var _youtubeApi2 = _interopRequireDefault(_youtubeApi);

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
			// Youtube-api authenticates
			_youtubeApi2.default.authenticate({
				type: 'key',
				key: process.env.GOOGLE_API_KEY
			});

			// Create socket connection & Write(Send message)
			var results = { success: false, error: false, type: 'message', data: '' },
			    guest = 'guest',
			    csbot = 'nancy';

			var csConfig = { host: process.env.BOT_DNS, port: process.env.BOT_PORT, allowHalfOpen: true },
			    csSocket = _net2.default.createConnection(csConfig, function () {
				var payload = guest + '\0' + csbot + '\0' + req.body.message + '\0';
				csSocket.write(payload);
			});

			// Response from TCP server
			csSocket.on('data', function (data) {
				var message = data.toString();

				results.success = true;
				results.data = message;
			});

			// Socket error
			csSocket.on('error', function (error) {
				console.log(error + ' ' + csSocket.address()[1]);
				console.log(process.env.BOT_DNS);

				results.success = false;
				results.error = true;
			});

			// Socket end
			csSocket.on('end', function () {
				switch (results.data.split(' ')[0]) {
					// Youtube trending
					case 'YOUTUBE-TRENDING':
						var told_num = Number(results.data.split('.')[1]);

						_youtubeApi2.default.videos.list({
							part: 'snippet',
							chart: 'mostPopular',
							regionCode: 'KR',
							maxResults: told_num
						}, function (error, data) {
							if (error) {
								console.log('error', error);
								results.success = false;
								results.error = true;
							} else {
								var item = data.items[told_num - 1];
								results.data = item;
								results.type = 'youtube-api';
							}

							res.send(results);
						});
						break;

					default:
						res.send(results);
				}
			});
		}
	}]);

	return ChattingController;
}();

exports.default = ChattingController;