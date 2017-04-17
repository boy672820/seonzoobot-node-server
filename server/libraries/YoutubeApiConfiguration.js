/* jshint esversion: 6 */
import Youtube from 'youtube-api';
import GOOGLEAPIS from '../../certificates/google-apis.json';


export default class YoutubeApiConfiguration extends Youtube {
	constructor() {
		super().authenticate( {
			type: 'key',
			key: GOOGLEAPIS.key
		} );
	}
}
