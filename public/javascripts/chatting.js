( function ( $ ) {

	/**
	 * Document ready
	 */
	$( document ).ready( function () {

		/** Chatting form submit event handle */
		$( '.chatting-form' ).submit( function ( e ) {
			var $this = $( this ),
				serialize = $this.serialize();

			$.ajax( {
				url: '/chatting/send-message',
				type: 'post',
				data: serialize,

				success: function ( res ) {
					var $message = $( '<p>' );

					if ( ! res.success ) {
						if ( res.error )
							console.log( 'error', '서버에 에러가 발생했습니다.' );
						else
							console.log( 'error', 'Not connection' );

						return;
					}

					if ( res.type === 'youtube-api' ) {
						$message.append( '<a href="https://www.youtube.com/watch?v=' + res.data.id + '" target="_blank">' + res.data.snippet.title + '</a>' );
					} else {
						$message.html( res.data );
					}

					$( '.chatting-result' ).html( $message );
				},

				error: function ( req, status, error ) {
					console.log( 'code: ' + req.status + '\n' + 'message: ' + req.responseText + '\n' + 'error: ' + error );
				}
			} );

			e.preventDefault();
		} );

	} );

} )( jQuery );
