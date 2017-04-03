var express = require('express');
var net = require( 'net' );
var router = express.Router();

var csConfig = { host: 'ec2-13-124-15-185.ap-northeast-2.compute.amazonaws.com', port: 15509, allowHalfOpen: true },
	csbot = 'nancy',
	csSocket = net.createConnection( csConfig, function () {
		var payload = 'guest' + '\x00' + csbot + '\x00' + '안녕' + '\x00';
		csSocket.write( payload );
	} );

csSocket.on( 'data', function ( data ) {
	console.log( data.toString() );
} );

csSocket.on( 'error', function( error ) {
	console.log( 'error from server ' + error + ' ' + csSocket.address()[ 1 ] );
} );

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.render('chatting', { title: 'Chatting' });
});

module.exports = router;
