define( [
	"jquery"
], function( $ ) {
	"use strict";

	return function( name ) {
		return $.async.data[ name ];
	};
} );
