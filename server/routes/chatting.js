var express = require('express'),
	router = express.Router(),
	Net = require( 'net' ),
	Youtube = require( 'youtube-api' );


// Youtube-api authenticates
Youtube.authenticate( {
	type: 'key',
	key: process.env.GOOGLE_API_KEY
} );


/* GET chatting listing. */
router.get( '/', function( req, res ) {
	res.render( 'chatting', { title: 'Chatting' } );
});

router.post( '/send-message', function ( req, res ) {
	// Create socket connection & Write(Send message)
	var results = { success: false, error: false, type: 'message', data: '' },
		csConfig = { host: process.env.BOT_DNS, port: process.env.BOT_PORT, allowHalfOpen: true },
		guest = 'guest',
		csbot = 'nancy',
		csSocket = Net.createConnection( csConfig, function () {
			var message = req.body.message,
				payload = guest + '\x00' + csbot + '\x00' + message + '\x00';

			csSocket.write( payload );
		} );

	// Response from TCP server
	csSocket.on( 'data', function ( data ) {
		var message = data.toString();

		results.success = true;
		results.data = message;
	} );

	// Socket error
	csSocket.on( 'error', function( error ) {
		console.log( error + ' ' + csSocket.address()[ 1 ] );
		console.log( process.env.BOT_DNS );

		results.success = false;
		results.error = true;
	} );

	// Socket end
	csSocket.on( 'end', function () {
		switch ( results.data.split( ' ' )[ 0 ] ) {
			// Youtube trending
			case 'YOUTUBE-TRENDING':
				var told_num = Number( results.data.split( '.' )[ 1 ] );

				Youtube.videos.list(
					{
						part: 'snippet',
						chart: 'mostPopular',
						regionCode: 'KR',
						maxResults: told_num
					},
					function ( error, data ) {
						if ( error ) {
							console.log( 'error', error );
							results.success = false;
							results.error = true;
						} else {
							var item = data.items[ told_num - 1 ];
							results.data = item;
							results.type = 'youtube-api';
						}

						res.send( results );
					}
				);
			break;

			default:
				res.send( results );
		}
	} );
} );

module.exports = router;
