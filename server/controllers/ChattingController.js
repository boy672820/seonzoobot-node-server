/* jshint esversion: 6 */
import Net from 'net';
import ChatScriptSocketConnection from '../libraries/ChatScriptSocketConnection';
import YoutubeApiConfiguration from '../libraries/YoutubeApiConfiguration';


/**
 * Created at 2017-04-11
 */
export default class ChattingController {

	/**
	 * GET - Route index render
	 */
	index( req, res ) {
		res.render( 'chatting', { title: 'Chatting' } );
	}

	/**
	 * POST - Sending created messages
	 */
	sendMessage( req, res ) {
		const csSocket = new ChatScriptSocketConnection( req.body.message );

		csSocket.data();
	}
}
