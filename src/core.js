define( [
	"jquery",
	"./var/attr",
	"./var/callback",
	"./var/data"
], function( $, attr, callback, data ) {
	"use strict";

	var Async = function( form, callbacks ) {
		this.action = attr.action( form );
		this.callbacks = {
			before: callback( 'before', callbacks ),
			error: callback( 'error', callbacks ),
			success: callback( 'success', callbacks )
		};

		this.prototype = {};
		this.elements = [];
		this.form = form;
		this.init();
	};

	$.async = {
		version: "@VERSION",
		data: {
			form: "async",
			elements: "async-element",
			state: "previous-state"
		}
	};

	$.extend( $.fn, {
		async: function( options ) {
			options = options || {};

			$( this ).each( function() {
				return $( this ).data( data( 'form' ), new Async( this, options ) );
			} );
		}
	} );

	return Async;
} );
