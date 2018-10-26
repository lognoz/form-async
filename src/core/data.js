define( [
	"jquery",
	"./Async",
	"../var/attr"
], function( $, Async, attr ) {
	"use strict";

	$.extend( Async.prototype, {
		data: function( element, id ) {
			var key, data = {},
				self = this;

			$.each( this.dependency( element, id ), function( index, id ) {
				var element = self.elements[ id ],
					name = element.name,
					value = attr.value( element, element.selector );

				if ( name.substr( -2 ) === "[]" ) {
					name = name.substr( 0, name.length - 2 );
					data[ name ] = data[ name ] || [];

					if ( value !== "" ) {
						data[ name ].push( value );
					}
				} else {
					data[ name ] = value;
				}

				for ( key in data ) {
					if ( data[ key ] instanceof Array && data[ key ].length === 0 ) {
						data[ key ] = "";
					}
				}
			} );

			return data;
		},
		dependency: function( element, id ) {
			if ( element.type === "checkbox" ) {
				return this.find( this.elements, [ element.name ] );
			} else if ( element.group ) {
				return this.find( this.elements, element.group );
			} else {
				return [ id ];
			}
		},
		find: function( elements, list ) {
			var data = [];

			$( elements ).each( function( index, element ) {
				if ( list.indexOf( element.name ) !== -1 ) {
					data.push( index );
				}
			} );

			return data;
		}
	} );
} );
