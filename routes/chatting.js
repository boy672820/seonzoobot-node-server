var express = require('express');
var net = require( 'net' );
var router = express.Router();

/* GET users listing. */
router.get( '/', function( req, res ) {
	res.render( 'chatting', { title: 'Chatting' } );
});

router.post( '/send-message', function ( req, res ) {
	// Create socket connection & Write(Send message)
	var result = { success: false, error: false, message: '' },
		csConfig = { host: 'ec2-13-124-15-185.ap-northeast-2.compute.amazonaws.com', port: 15509, allowHalfOpen: true },
		csbot = 'nancy',
		csSocket = net.createConnection( csConfig, function () {
			var message = req.body.message,
				payload = 'guest' + '\x00' + csbot + '\x00' + message + '\x00';

			csSocket.write( payload );
		} );

	// Response from TCP server
	csSocket.on( 'data', function ( data ) {
		var message = data.toString();

		result.success = true;
		result.message = message;
	} );

	// Socket error
	csSocket.on( 'error', function( error ) {
		result.success = false;
		result.error = true;
		console.log( 'error from server: ' + error + ' ' + csSocket.address()[ 1 ] );
	} );

	// Socket end
	csSocket.on( 'end', function () {
		res.send( result );
	} );
} );

module.exports = router;
