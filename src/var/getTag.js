define( function() {
	'use strict';

	return function( selector ) {
		return selector.tagName.toLowerCase();
	};
} );
