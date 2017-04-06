var express = require('express'),
	router = express.Router(),
	Net = require( 'net' ),
	Youtube = require( 'youtube-api' ),
	Bot = require( 'messenger-bot' );


// Youtube-api authenticates
Youtube.authenticate( {
	type: 'key',
	key: process.env.GOOGLE_API_KEY
} );

// Messenger-bot create instance & setting
var bot = new Bot( {
	token: process.env.FB_TOKEN,
	verify: 'seonzoo_verify_token',
	app_secret: process.env.FB_APP_SECRET
} );

/** Messenger-bot on error */
bot.on( 'error', function ( error ) {
	console.log( error.message );
} );

/** Messenger-bot on message */
bot.on( 'message', function ( payload, reply ) {
	var text = payload.message.text;

	bot.getProfile( payload.sender.id, function ( error, profile ) {
		if ( error ) {
			console.log( 1 );
			console.log( error );
			//throw error;
		}

		// Messenger-bot reply
		var botReply = function ( message ) {
			reply( { text: message }, function ( error ) {
				if ( error ) {
					console.log( 2 );
					console.log( error );
				}
			} );
		};

		// Create socket connection & Write(Send message)
		var results = { success: false, error: false, type: 'message', data: '' },
			csConfig = { host: process.env.BOT_DNS, port: process.env.BOT_PORT, allowHalfOpen: true },
			guest = 'guest',
			csbot = 'nancy',
			csSocket = Net.createConnection( csConfig, function () {
				var payload = guest + '\x00' + csbot + '\x00' + text + '\x00';
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

			results.success = false;
			results.error = true;
		} );

		// Socket end
		csSocket.on( 'end', function () {
			switch ( results.data ) {
				// Youtube trending
				case 'YOUTUBE-TRENDING':
					Youtube.videos.list(
						{
							part: 'snippet',
							chart: 'mostPopular',
							regionCode: 'KR',
							maxResults: 1
						},
						function ( error, data ) {
							if ( error ) {
								console.log( 'error', error );
								results.success = false;
								results.error = true;
							} else {
								var item = data.items[ 0 ];
								results.data = item;
								results.type = 'youtube-api';
							}

							botReply( 'https://www.youtube.com/watch?v=' + results.data.id );
						}
					);
				break;

				default:
					botReply( results.data );
			}
		} );
	} );
} );


/** GET webhook listing. */
router.get( '/', function ( req, res ) {
	console.log( req.query[ 'hub.verify_token' ] );
	if ( req.query[ 'hub.verify_token' ] === "seonzoo_verify_token" ) {
		res.send( req.query[ 'hub.challenge' ] );
	} else {
		res.send( 'Invalid verify token' );
	}
} );

/** POST webhook listing. */
router.post( '/', function ( req, res ) {
	bot._handleMessage( req.body );
	res.end( JSON.stringify( { status: 'ok' } ) );
} );

module.exports = router;
