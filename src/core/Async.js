define( [
	"jquery",
	"../var/attr",
	"../var/callback"
], function( $, attr, callback ) {
	"use strict";

	function Async( form, callbacks ) {
		this.action = attr.action( form );
		this.callbacks = {
			before: callback( "before", callbacks ),
			error: callback( "error", callbacks ),
			success: callback( "success", callbacks )
		};

		this.prototype = {};
		this.elements = [];
		this.form = form;
		this.init();
	}

	return Async;
} );
