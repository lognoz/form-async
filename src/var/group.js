define( function() {
	"use strict";

	return function( selector ) {
		var data = selector.getAttribute( "data-autosave-group" );
		return data ? data.replace( /\s/g, "" ).split( "," ) : null;
	};
} );
