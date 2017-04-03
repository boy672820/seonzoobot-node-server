( function ( $ ) {

	// Chatting form submit event handle
	$( '.chatting-form' ).submit( function ( e ) {
		var $this = $( this ),
			serialize = $this.serialize();

		$.ajax( {
			url: '/chatting/send-message',
			type: 'post',
			data: serialize,
			success: function ( res ) {
				if ( res.success )
					$( '.chatting-result' ).html( '<p>' + res.message + '</p>' );
				else
					if ( res.error ) console.log( '서버에 에러가 발생했습니다.' );
					else console.log( 'not connect' );
			},
			error: function ( req, status, error ) {
				console.log( 'code: ' + req.status + '\n' + 'message: ' + req.responseText + '\n' + 'error: ' + error );
			}
		} );

		e.preventDefault();
	} );

} )( jQuery );
