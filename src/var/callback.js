define( [
	"./isFunction"
], function( isFunction ) {
	"use strict";

	return function( type, callbacks ) {
		return isFunction( callbacks[ type ] ) ? callbacks[ type ] : new Function();
	};
} );
