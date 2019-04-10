define( [
	"jquery",
	"./var/data",
	"./core/Async",
	"./core/event",
	"./core/data"
], function( $, data, Async ) {
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
