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

		csSocket.data( data => {
			return data.toString();
		} );

		csSocket.error( error => {
			res.send( '죄송합니다. 서버에 오류가 발생했습니다. 관리자에게 문의해 주세요.' );
		} );

		csSocket.end( result => {
			let data = result.getData(),
				sendJson = {};

			switch ( data.split( ' ' )[ 0 ] ) {
				case 'YOUTUBE-TRENDING':
					let count = Number( data.split( '.' )[ 1 ] );

					const youtube = new YoutubeApiConfiguration();
					youtube.videos.list(
						{
							part: 'snippet',
							chart: 'mostPopular',
							regionCode: 'KR',
							maxResults: count
						},
						( error, data ) => {
							try {
								if ( error ) throw error;
								sendJson = {
									data: data.items[ count - 1 ],
									type: 'youtube-api'
								};
							}
							catch ( e ) {
								sendJson = '유튜브 동영상을 가져오는 중 문제가 생겼습니다. 다시 시도해도 같은 문제가 발생할 경우 관리자에게 문의해 주세요.';
							}
						}
					);
				break;

				default:
					sendJson = data;
			}

			res.send( sendJson );
		} );
	}
}
