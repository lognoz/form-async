define( function() {
	"use strict";

	return function( selector ) {
		return selector.getAttribute( "name" ) || selector.getAttribute( "data-name" );
	};
} );
