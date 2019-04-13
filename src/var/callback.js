define( [
	"./isFunction"
], function( isFunction ) {
	"use strict";

	return function( type, callbacks ) {
		if ( isFunction( callbacks[ type ] ) ) {
			return callbacks[ type ];
		} else {
			return $.async.defaults !== undefined && isFunction( $.async.defaults[ type ] ) ?
				$.async.defaults[ type ] : new Function();
		}
	};
} );
