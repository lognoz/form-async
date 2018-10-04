define( function() {
	"use strict";

	return function( selector ) {
		return selector.getAttribute( "action" ) ||
			selector.getAttribute( "data-action" ) || null;
	};
} );
