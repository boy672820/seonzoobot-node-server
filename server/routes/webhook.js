/* jshint esversion: 6 */
import express from 'express';
import Net from  'net';
import Youtube from  'youtube-api';
import Bot from  'messenger-bot';


// Youtube-api authenticates
Youtube.authenticate( {
	type: 'key',
	key: process.env.GOOGLE_API_KEY
} );

// Messenger-bot create instance & setting
const bot = new Bot( {
	token: process.env.FB_TOKEN,
	verify: 'seonzoo_verify_token',
	app_secret: process.env.FB_APP_SECRET
} );

/** Messenger-bot on error */
bot.on( 'error', error => {
	console.log( error.message );
} );

/** Messenger-bot on message */
bot.on( 'message', ( payload, reply ) => {
	let text = payload.message.text,
		sender_id = payload.sender.id;

	bot.getProfile( sender_id, ( error, profile ) => {
		if ( error ) {
			console.log( "getProfile", error );
			//throw error;
		}

		// Messenger-bot reply
		let botReply = message => {
			reply( message,  error => {
				if ( error ) {
					console.log( "sendMessage", error );
					//throw error;
				}
			} );
		};

		// Create socket connection & Write(Send message)
		let results = { success: false, error: false, type: 'message', data: '' },
			guest = sender_id,
			csbot = 'nancy';

		const csConfig = { host: process.env.BOT_DNS, port: process.env.BOT_PORT, allowHalfOpen: true },
			csSocket = Net.createConnection( csConfig, () => {
				let payload = `${guest}\x00${csbot}\x00${text}\x00`;
				csSocket.write( payload );
			} );

		// Response from TCP server
		csSocket.on( 'data', data => {
			let message = data.toString();

			results.success = true;
			results.data = message;
		} );

		// Socket error
		csSocket.on( 'error', error => {
			console.log( `${error} ${csSocket.address()[ 1 ]}` );

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

							let youtube = results.data,
								message = {
									"attachment": {
										"type": "template",
										"payload": {
											"template_type": "generic",
											"elements": [
												{
													"title": youtube.snippet.title,
													"image_url": youtube.snippet.thumbnails.medium.url,
													"subtitle": youtube.snippet.description,
													"buttons": [
														{
															"type": "web_url",
															"url": `https://www.youtube.com/watch?v=${youtube.id}`,
															"title": "유튜브 링크로 이동"
														}
													]
												}
											]
										}
									}
								};

							botReply( message );
						}
					);
				break;

				default:
					botReply( { text: results.data } );
			}
		} );
	} );
} );


const router = express.Router();

/** GET webhook listing. */
router.get( '/', ( req, res ) => {
	console.log( req.query[ 'hub.verify_token' ] );
	if ( req.query[ 'hub.verify_token' ] === "seonzoo_verify_token" ) {
		res.send( req.query[ 'hub.challenge' ] );
	} else {
		res.send( 'Invalid verify token' );
	}
} );

/** POST webhook listing. */
router.post( '/', ( req, res ) => {
	bot._handleMessage( req.body );
	res.end( JSON.stringify( { status: 'ok' } ) );
} );

module.exports = router;
