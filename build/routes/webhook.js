'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _net = require('net');

var _net2 = _interopRequireDefault(_net);

var _youtubeApi = require('youtube-api');

var _youtubeApi2 = _interopRequireDefault(_youtubeApi);

var _messengerBot = require('messenger-bot');

var _messengerBot2 = _interopRequireDefault(_messengerBot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Youtube-api authenticates
/* jshint esversion: 6 */
_youtubeApi2.default.authenticate({
	type: 'key',
	key: process.env.GOOGLE_API_KEY
});

// Messenger-bot create instance & setting
var bot = new _messengerBot2.default({
	token: process.env.FB_TOKEN,
	verify: 'seonzoo_verify_token',
	app_secret: process.env.FB_APP_SECRET
});

/** Messenger-bot on error */
bot.on('error', function (error) {
	console.log(error.message);
});

/** Messenger-bot on message */
bot.on('message', function (payload, reply) {
	var text = payload.message.text,
	    sender_id = payload.sender.id;

	bot.getProfile(sender_id, function (error, profile) {
		if (error) {
			console.log("getProfile", error);
			//throw error;
		}

		// Messenger-bot reply
		var botReply = function botReply(message) {
			reply(message, function (error) {
				if (error) {
					console.log("sendMessage", error);
					//throw error;
				}
			});
		};

		// Create socket connection & Write(Send message)
		var results = { success: false, error: false, type: 'message', data: '' },
		    guest = sender_id,
		    csbot = 'nancy';

		var csConfig = { host: process.env.BOT_DNS, port: process.env.BOT_PORT, allowHalfOpen: true },
		    csSocket = _net2.default.createConnection(csConfig, function () {
			var payload = guest + '\0' + csbot + '\0' + text + '\0';
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

						var youtube = results.data,
						    message = {
							"attachment": {
								"type": "template",
								"payload": {
									"template_type": "generic",
									"elements": [{
										"title": youtube.snippet.title,
										"image_url": youtube.snippet.thumbnails.medium.url,
										"subtitle": youtube.snippet.description,
										"buttons": [{
											"type": "web_url",
											"url": 'https://www.youtube.com/watch?v=' + youtube.id,
											"title": "유튜브 링크로 이동"
										}]
									}]
								}
							}
						};

						botReply(message);
					});
					break;

				default:
					botReply({ text: results.data });
			}
		});
	});
});

var router = _express2.default.Router();

/** GET webhook listing. */
router.get('/', function (req, res) {
	console.log(req.query['hub.verify_token']);
	if (req.query['hub.verify_token'] === "seonzoo_verify_token") {
		res.send(req.query['hub.challenge']);
	} else {
		res.send('Invalid verify token');
	}
});

/** POST webhook listing. */
router.post('/', function (req, res) {
	bot._handleMessage(req.body);
	res.end(JSON.stringify({ status: 'ok' }));
});

module.exports = router;