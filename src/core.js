define( [
	"jquery",
	"./core/Async",
	"./var/data"
], function( $, Async, data ) {
	"use strict";

	$.async = {
		version: "@VERSION",
		data: {
			form: "async",
			elements: "async-element",
			state: "previous-state"
		}
	};

	$.fn.async = function( options ) {
		options = options || {};

		$( this ).each( function() {
			return $( this ).data( data( "form" ), new Async( this, options ) );
		} );
	};
} );
