/*!
 * JavaScript Autosave v<%= version %>
 * https://github.com/lognoz/js-autosave
 *
 * Copyright 2018, <%= years %> Marc-Antoine Loignon
 * Released under the MIT license
 */
( function( factory ) {
	if ( typeof define === 'function' && define.amd ) {
		define( [ 'jquery' ], factory );
	} else if ( typeof exports === 'object' ) {
		module.exports = factory( require( 'jquery' ) );
	} else {
		factory( jQuery );
	}
}( function( $, window ) {
	'use strict';

	var properties = {
		tag: function( selector ) {
			return selector.tagName.toLowerCase();
		},
		action: function( selector ) {
			return selector.getAttribute( 'action' ) || selector.getAttribute( 'data-action' ) || null;
		},
		name: function( selector ) {
			return selector.getAttribute( 'name' ) || selector.getAttribute( 'data-name' );
		},
		type: function( selector ) {
			return selector.getAttribute( 'type' ) || null;
		},
		valid: function( selector ) {
			return this.name( selector ) && (
				[ 'input', 'checkbox', 'radio', 'textarea', 'select' ].indexOf( this.tag(selector) ) != -1 ||
				selector.getAttribute( 'contentEditable' )
			);
		},
		handler: function( selector ) {
			return [ 'checkbox', 'radio' ].indexOf( this.type( selector ) ) !== -1 ||
				this.tag( selector ) === 'select' ? 'change' : 'blur';
		},
		state: function( selector ) {
			return [ 'checkbox', 'radio' ].indexOf( this.type( selector ) ) !== -1 ? selector.checked :
				selector.value || selector.innerHTML;
		},
		group: function( selector ) {
			var data = selector.getAttribute( 'data-autosave-group' );
			return data ? data.replace( /\s/g, '' ).split( ',' ) : null;
		},
		value: function( reference, selector, name ) {
			if ([ 'input', 'select', 'textarea' ].indexOf( reference.tag ) !== -1 && ( reference.type !== 'checkbox' || selector.checked ))
				return $( selector ).val();
			else
				return $( selector ).html();
		}
	};

	$.autosave = function( form, callbacks ) {
		this.action = properties.action( form );
		this.callbacks = callbacks;
		this.elements = [];
		this.form = form;
		this.init();
	};

	$.extend( $.autosave, {
		prototype: {
			targets: function() {
				if ( this.form.children.length == 0 && $(this.form).is( "select, input, textarea, [contentEditable]" ) ) {
					return [ this.form ];
				} else {
					return $( this.form )
						.find( "select, input, textarea, [contentEditable]" )
						.not( ":submit, :reset, :image, :disabled" );
				}
			},
			data: function( element, id ) {
				var dependency = this.dependency( element, id ),
					key,
					data = {},
					t = this;

				$.each( dependency, function( index, id ) {
					var element = t.elements[ id ];
					var name = element.name;
					var value = properties.value( element, element.selector, name );

					if ( name.substr(-2) === '[]' ) {
						name = name.substr( 0, name.length - 2 );
						data[ name ] = data[ name ] || [];

						if ( value !== '' )
							data[ name ].push( value );
					} else {
						data[ name ] = value;
					}

					for ( key in data ) {
						if ( data[ key ] instanceof Array && data[ key ].length === 0 )
							data[key] = '';
					}
				} );

				return data;
			},
			call: function( element, state, id ) {
				var data = this.data( element, id );
				var action = element.action || this.action;
				var callbacks = this.callbacks || {};
				var t = this;
				var aborted = false;
				var request = {
					action: action,
					data: data,
					abort: function() {
						aborted = true;
					},
					properties: {
						handler : element.handler,
						name    : element.name,
						tag     : element.tag,
						type    : element.type
					}
				};

				if ( callbacks.before !== undefined )
					callbacks.before.call( element.selector, request );

				if ( aborted )
					return;

				delete request.abort;
				request.callbacks = callbacks;

				$.ajax( {
					method: 'POST',
					url: action,
					data: data,
					context: element.selector,
					success: function( response, status, xhr ) {
						$( element.selector ).data( 'previous-state', state );

						if ( callbacks.success !== undefined )
							callbacks.success.call( element.selector, response, request );
					},
					error: function() {
						if ( callbacks.success !== undefined )
							callbacks.fail.call( element.selector, request );
					}
				} );
			},
			find: function( elements, list ) {
 				var data = [],
					t = this;

				$( elements ).each( function( index, element ) {
					if ( list.indexOf( element.name ) !== -1 ) {
						data.push( index );
					}
				});

				return data;
			},
			dependency: function( element, id ) {
				if ( element.type === 'checkbox' ) {
					return this.find( this.elements, [ element.name ] );
				} else if ( element.group ) {
					return this.find( this.elements, element.group );
				} else {
					return [ id ];
				}
			},
			init: function() {
				var targets = this.targets();
				var t = this;

				function save( event ) {
					var target = event.target;
					var id = $.data( target, 'autosave-element' );
					var element = t.elements[ id ];
					var state = properties.state( target );

					if ( $.data( target, 'previous-state' ) !== state ) {
						t.call( element, state, id );
					}
				}

				$.each( targets, function( key, target ) {
					t.elements.push({
						selector : target,
						action   : properties.action( target ),
						group    : properties.group( target ),
						handler  : properties.handler( target ),
						name     : properties.name( target ),
						tag      : properties.tag( target ),
						type     : properties.type( target )
					});

					$( target )
						.on( properties.handler( target ), save )
						.data( 'autosave-element', t.elements.length -1 )
						.data( 'previous-state', properties.state( target ) );
				} );
			}
		}
	} );

	$.extend( $.fn, {
		autosave: function( options ) {
			$( this ).each( function( event ) {
				return $( this ).data( 'autosave', new $.autosave( this, options ) );
			} );
		}
	} );
}));
