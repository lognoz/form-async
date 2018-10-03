define( function() {
	'use strict';

	return function( selector ) {
		return selector.getAttribute( 'type' ) || null;
	};
} );
