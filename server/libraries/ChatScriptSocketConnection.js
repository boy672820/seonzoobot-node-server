/* jshint esversion: 6 */
import Net from 'net';
import CHATSCRIPTHOSTS from '../../certificates/chatscript-hosts.json';


// Private variables
let _socket;

export default class ChatScriptSocketConnection {
	constructor( message ) {
		_socket = Net.createConnection( { host: CHATSCRIPTHOSTS.host, port: CHATSCRIPTHOSTS.port, allowHalfOpen: true }, () => {
			let payload = `${guest}\x00${csbot}\x00${message}\x00`;
			_socket.write( payload );
		} );
	}

	data( callback ) {
		_socket.on( 'data', data => {
			callback( data );
			Results.setData( data );
		} );
	}

	error( callback ) {
		_socket.on( 'error', error => {
			callback( error );
			Results.setError( error );
		} );
	}

	end( callback ) {
		_socket.on( 'end', () => {
			try {
				let error = Results.getError();
				if ( error ) throw error;

				callback();
			}
			catch ( e ) {
				console.log( 'error', e );
			}
		} );
	}
}


// Private variables
let _data, _error;

const Results = class {
	setData( data ) {
		_data = data;
	}
	setError( error ) {
		_error = error;
	}
	getData() {
		return _data;
	}
	getError() {
		return _error;
	}
};
