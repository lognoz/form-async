define( [
	"jquery",
	"./var/data"
], function( $, data ) {
	"use strict";

	function Request( options ) {
		this.aborted = false;
		this.options = options;
		this.attribute = options.attribute;
		this.callbacks = options.callbacks;
		this.context = options.context;
		this.state = options.state;

		this.init();
	};

	Request.prototype = {
		abort: function() {
			this.aborted = true;
		},
		init: function() {
			this.request = {
				abort: this.abort.bind( this ),
				action: this.options.action,
				data: this.options.data,
				attribute: {
					handler: this.attribute.handler,
					name: this.attribute.name,
					tag: this.attribute.tag,
					type: this.attribute.type
				}
			};

			this.callbacks.before
				.bind( this.context )( this.request );

			if ( !this.aborted ) {
				delete this.request.abort;

				$.extend( this.request, {
					success: this.success.bind( this ),
					error: this.error.bind( this ),
					retry: this.call.bind( this )
				} );

				this.call();
			}
		},
		call: function() {
			$.ajax( {
				mode: "abort",
				method: "post",
				port: "async",
				url: this.request.action,
				data: this.request.data,
				success: this.success.bind( this ),
				error: this.error.bind( this )
			} );
		},
		success: function( response ) {
			$.data( this.context, data( "state" ), this.state );

			this.callbacks.success
				.bind( this.context )( response, this.request );
		},
		error: function() {
			this.callbacks.error
				.bind( this.context )( this.request );
		}
	};

	return Request;
} );
