/* jshint esversion: 6 */
import express from 'express';
import Net from  'net';
import Youtube from  'youtube-api';


// Youtube-api authenticates
Youtube.authenticate( {
	type: 'key',
	key: process.env.GOOGLE_API_KEY
} );


const router = express.Router();

/* GET chatting listing. */
router.get( '/', ( req, res ) => {
	res.render( 'chatting', { title: 'Chatting' } );
});

router.post( '/send-message', ( req, res ) => {
	// Create socket connection & Write(Send message)
	let results = { success: false, error: false, type: 'message', data: '' },
		guest = 'guest',
		csbot = 'nancy';

	const csConfig = { host: process.env.BOT_DNS, port: process.env.BOT_PORT, allowHalfOpen: true },
		csSocket = Net.createConnection( csConfig, () => {
			let payload = `${guest}\x00${csbot}\x00${req.body.message}\x00`;
			csSocket.write( payload );
		} );

	// Response from TCP server
	csSocket.on( 'data', data => {
		let message = data.toString();

		results.success = true;
		results.data = message;
	} );

	// Socket error
	csSocket.on( 'error',  error => {
		console.log( `${error} ${csSocket.address()[ 1 ]}` );
		console.log( process.env.BOT_DNS );

		results.success = false;
		results.error = true;
	} );

	// Socket end
	csSocket.on( 'end', () => {
		switch ( results.data.split( ' ' )[ 0 ] ) {
			// Youtube trending
			case 'YOUTUBE-TRENDING':
				let told_num = Number( results.data.split( '.' )[ 1 ] );

				Youtube.videos.list(
					{
						part: 'snippet',
						chart: 'mostPopular',
						regionCode: 'KR',
						maxResults: told_num
					},
					( error, data ) => {
						if ( error ) {
							console.log( 'error', error );
							results.success = false;
							results.error = true;
						} else {
							let item = data.items[ told_num - 1 ];
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
