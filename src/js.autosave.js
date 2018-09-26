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
}( function( $ ) {
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
				[ 'input', 'checkbox', 'radio', 'textarea', 'select' ].indexOf( this.tag( selector ) ) != -1 ||
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
		value: function( reference, selector ) {
			if ([ 'input', 'select', 'textarea' ].indexOf( reference.tag ) !== -1 && ( reference.type !== 'checkbox' || selector.checked ) )
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
				if ( this.form.children.length == 0 && $( this.form ).is( "select, input, textarea, [contentEditable]" ) ) {
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
					var element = t.elements[ id ],
						name = element.name,
						value = properties.value( element, element.selector );

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
							handler : element.handler,
							name    : element.name,
							tag     : element.tag,
							type    : element.type
						}
					};

				if (typeof callbacks.before == 'function')
					callbacks.before.call( element.selector, request );

				if ( aborted )
					return;

				delete request.abort;

				$.extend( request, {
					response: '',
					success: function() {
						if ( typeof callbacks.success == 'function' )
							callbacks.success.call( element.selector, request.response, request );
					},
					fail: function() {
						if ( typeof callbacks.fail == 'function' )
							callbacks.fail.call( element.selector, request );
					},
					retry: function() {
						t.call( element, state, id );
					}
				} );

				$.ajax( {
					method: 'POST',
					url: action,
					data: data,
					context: element.selector,
					success: function( response ) {
						$( element.selector ).data( 'previous-state', state );
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
				if ( element.type === 'checkbox' ) {
					return this.find( this.elements, [ element.name ] );
				} else if ( element.group ) {
					return this.find( this.elements, element.group );
				} else {
					return [ id ];
				}
			},
			init: function() {
				var targets = this.targets(),
					t = this;

				function save( event ) {
					var target = event.target,
						id = $.data( target, 'autosave-element' ),
						element = t.elements[ id ],
						state = properties.state( target );

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
						.data( 'autosave-element', t.elements.length - 1 )
						.data( 'previous-state', properties.state( target ) );
				} );
			}
		}
	} );

	$.extend( $.fn, {
		autosave: function( options ) {
			$( this ).each( function() {
				return $( this ).data( 'autosave', new $.autosave( this, options ) );
			} );
		}
	} );
} ) );
