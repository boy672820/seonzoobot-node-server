'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* jshint esversion: 6 */


var _net = require('net');

var _net2 = _interopRequireDefault(_net);

var _chatscriptHosts = require('../../certificates/chatscript-hosts.json');

var _chatscriptHosts2 = _interopRequireDefault(_chatscriptHosts);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Private variables
var _socket = void 0;

var ChatScriptSocketConnection = function () {
	function ChatScriptSocketConnection(message) {
		_classCallCheck(this, ChatScriptSocketConnection);

		_socket = _net2.default.createConnection({ host: _chatscriptHosts2.default.host, port: _chatscriptHosts2.default.port, allowHalfOpen: true }, function () {
			var payload = guest + '\0' + csbot + '\0' + message + '\0';
			_socket.write(payload);
		});
	}

	_createClass(ChatScriptSocketConnection, [{
		key: 'data',
		value: function data(callback) {
			_socket.on('data', function (data) {
				callback(data);
				Results.setData(data);
			});
		}
	}, {
		key: 'error',
		value: function error(callback) {
			_socket.on('error', function (error) {
				callback(error);
				Results.setError(error);
			});
		}
	}, {
		key: 'end',
		value: function end(callback) {
			_socket.on('end', function () {
				try {
					var error = Results.getError();
					if (error) throw error;

					callback();
				} catch (e) {
					console.log('error', e);
				}
			});
		}
	}]);

	return ChatScriptSocketConnection;
}();

// Private variables


exports.default = ChatScriptSocketConnection;
var _data = void 0,
    _error = void 0;

var Results = function () {
	function Results() {
		_classCallCheck(this, Results);
	}

	_createClass(Results, [{
		key: 'setData',
		value: function setData(data) {
			_data = data;
		}
	}, {
		key: 'setError',
		value: function setError(error) {
			_error = error;
		}
	}, {
		key: 'getData',
		value: function getData() {
			return _data;
		}
	}, {
		key: 'getError',
		value: function getError() {
			return _error;
		}
	}]);

	return Results;
}();