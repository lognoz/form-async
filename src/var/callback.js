define( [
	"./isFunction"
], function( isFunction ) {
	"use strict";

	return function( type, callbacks ) {
		return isFunction( callbacks[ type ] ) ? callbacks[ type ] : (
			$.async.defaults !== undefined && isFunction( $.async.defaults[ type ] ) ?
				$.async.defaults[ type ] : new Function()
		);
	};
} );
