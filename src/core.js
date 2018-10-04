define( [
	"jquery",
	"./var/action",
	"./var/value",
	"./var/state",
	"./var/group",
	"./var/handler",
	"./var/name",
	"./var/tag",
	"./var/type",
], function( $, action, value, state, group, handler, name, tag, type ) {
	"use strict";

	$.autosave = function( form, callbacks ) {
		this.action = action( form );
		this.callbacks = callbacks;
		this.elements = [];
		this.form = form;
		this.init();
	};

	$.extend( $.autosave, {
		prototype: {
			targets: function() {
				var valid = "select, input, textarea, [contentEditable]";
				if ( this.form.children.length === 0 && $( this.form ).is( valid ) ) {
					return [ this.form ];
				} else {
					return $( this.form )
						.find( valid )
						.not( ":submit, :reset, :image, :disabled, [data-disabled-autosave]" );
				}
			},
			data: function( element, id ) {
				var dependency = this.dependency( element, id ),
					key,
					data = {},
					t = this;

				$.each( dependency, function( index, id ) {
					var element = t.elements[ id ],
						name = element.name,
						value = value( element, element.selector );

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
			call: function( element, state, id ) {
				var aborted = false,
					action = element.action || this.action,
					callbacks = this.callbacks || {},
					data = this.data( element, id ),
					t = this,
					request = {
						action: action,
						data: data,
						abort: function() {
							aborted = true;
						},
						properties: {
							handler: element.handler,
							name: element.name,
							tag: element.tag,
							type: element.type
						}
					};

				if ( typeof callbacks.before == "function" ) {
					callbacks.before.call( element.selector, request );
				}

				if ( aborted ) {
					return;
				}

				delete request.abort;

				$.extend( request, {
					response: "",
					success: function() {
						if ( typeof callbacks.success == "function" ) {
							callbacks.success.call( element.selector, request.response, request );
						}
					},
					fail: function() {
						if ( typeof callbacks.fail == "function" ) {
							callbacks.fail.call( element.selector, request );
						}
					},
					retry: function() {
						t.call( element, state, id );
					}
				} );

				$.ajax( {
					method: "POST",
					url: action,
					data: data,
					context: element.selector,
					success: function( response ) {
						$( element.selector ).data( "previous-state", state );
						request.response = response;
						request.success();
					},
					error: function() {
						request.fail();
					}
				} );
			},
			find: function( elements, list ) {
				var data = [];

				$( elements ).each( function( index, element ) {
					if ( list.indexOf( element.name ) !== -1 ) {
						data.push( index );
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
			destroy: function() {
				$( this.form ).removeData( "autosave" );

				$.each( this.elements, function( index, properties ) {
					$( properties.selector )
						.off( properties.handler )
						.removeData( "autosave-element" )
						.removeData( "previous-state" );
				} );
			},
			init: function() {
				var targets = this.targets(),
					t = this;

				function save( event ) {
					var target = event.target,
						id = $.data( target, "autosave-element" ),
						element = t.elements[ id ],
						state = state( target );

					if ( $.data( target, "previous-state" ) !== state ) {
						t.call( element, state, id );
					}
				}

				$.each( targets, function( key, target ) {
					t.elements.push( {
						selector: target,
						action: action( target ),
						group: group( target ),
						handler: handler( target ),
						name: name( target ),
						tag: tag( target ),
						type: type( target )
					} );

					$( target )
						.on( handler( target ), save )
						.data( "autosave-element", t.elements.length - 1 )
						.data( "previous-state", state( target ) );
				} );
			}
		}
	} );

	$.extend( $.fn, {
		autosave: function( options ) {
			var constructor = [];

			$( this ).each( function() {
				constructor.push( new $.autosave( this, options ) );
				return $( this ).data( "autosave", constructor[ constructor.length - 1 ] );
			} );

			return {
				destroy: function() {
					$( constructor ).each( function() {
						this.destroy();
					} );
				}
			};
		}
	} );
} );
