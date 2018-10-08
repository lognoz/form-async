define( [
	"jquery",
	"./core",
	"./var/attr",
	"./var/data",
	"./var/targets"
], function( $, Async, attr, data, targets ) {
	"use strict";

	$.extend( Async.prototype, {
		init: function() {
			var self = this;

			$.each( targets( this.form ), function( key, target ) {
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
					.data( data( 'elements' ), self.elements.length - 1 )
					.data( data( 'state' ), attr.state( target ) );
			} );
		},
		save: function( event ) {
			var target = event.target,
				id = $.data( target, data( 'elements' ) ),
				element = this.elements[ id ],
				state = attr.state( target );

			if ( $.data( target, data( 'state' ) ) !== state ) {
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
