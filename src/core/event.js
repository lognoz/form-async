define( [
	"jquery",
	"./Async",
	"../request/Request",
	"../var/attr",
	"../var/data",
], function( $, Async, Request, attr, data ) {
	"use strict";

	function getTargets( form ) {
		var valid = "select, input, textarea, [contentEditable]";
		if ( form.children.length === 0 && $( form ).is( valid ) ) {
			return [ form ];
		} else {
			return $( form )
				.find( valid )
				.not( ":submit, :reset, :image, :disabled, [data-disabled-autosave]" );
		}
	}

	$.extend( Async.prototype, {
		init: function() {
			var self = this;

			$.each( getTargets( this.form ), function( key, target ) {
				self.elements.push( {
					selector: target,
					action: attr.action( target ),
					group: attr.group( target ),
					handler: attr.handler( target ),
					name: attr.name( target ),
					tag: attr.tag( target ),
					type: attr.type( target )
				} );

				$( target )
					.on( attr.handler( target ), self.save.bind( self ) )
					.data( data( "elements" ), self.elements.length - 1 )
					.data( data( "state" ), attr.state( target ) );
			} );
		},
		save: function( event ) {
			var target = event.target,
				id = $.data( target, data( "elements" ) ),
				element = this.elements[ id ],
				state = attr.state( target );

			if ( $.data( target, data( "state" ) ) !== state ) {
				return new Request( {
					action: element.action || this.action,
					attribute: element,
					callbacks: this.callbacks,
					context: target,
					data: this.data( element, id ),
					state: state
				} );
			}
		}
	} );

	return Async;
} );
