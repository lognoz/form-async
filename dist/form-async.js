/*!
 * Form Async v1.0.0
 * https://github.com/lognoz/form-async
 *
 * Copyright 2018, 2019
 * Form Async and other contributors
 * Released under the MIT license
 */
( function( factory ) {
	if ( typeof define === "function" && define.amd ) {
		define( [ "jquery" ], factory );
	} else if ( typeof exports === "object" ) {
		module.exports = factory( require( "jquery" ) );
	} else {
		factory( jQuery );
	}
} )( function( $ ) {
	"use strict";

	var data = function( name ) {
		return $.async.data[ name ];
	};

	var attr = {
		action: function( selector ) {
			return selector.getAttribute( "action" ) ||
				selector.getAttribute( "data-action" ) || null;
		},
		group: function( selector ) {
			var data = selector.getAttribute( "data-autosave-group" );
			return data ? data.replace( /\s/g, "" ).split( "," ) : null;
		},
		handler: function( selector ) {
			return [ "checkbox", "radio" ].indexOf( this.type( selector ) ) !== -1 ||
				this.tag( selector ) === "select" ? "change" : "blur";
		},
		name: function( selector ) {
			return selector.getAttribute( "name" ) || selector.getAttribute( "data-name" );
		},
		state: function( selector ) {
			return [ "checkbox", "radio" ].indexOf( this.type( selector ) ) !== -1 ?
				selector.checked : selector.value || selector.innerHTML;
		},
		tag: function( selector ) {
			return selector.tagName.toLowerCase();
		},
		type: function( selector ) {
			return selector.getAttribute( "type" ) || null;
		},
		value: function( reference, selector ) {
			if ( [ "input", "select", "textarea" ].indexOf( reference.tag ) !== -1 &&
				( reference.type !== "checkbox" || selector.checked ) ) {
				return $( selector ).val();
			} else {
				return $( selector ).html();
			}
		}
	};

	var isFunction = function isFunction( obj ) {
		return typeof obj === "function" && typeof obj.nodeType !== "number";
	};

	var callback = function( type, callbacks ) {
		if ( isFunction( callbacks[ type ] ) ) {
			return callbacks[ type ];
		} else {
			return $.async.defaults !== undefined && isFunction( $.async.defaults[ type ] ) ?
				$.async.defaults[ type ] : new Function();
		}
	};

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

	function Request( options ) {
		this.aborted = false;
		this.options = options;
		this.attribute = options.attribute;
		this.callbacks = options.callbacks;
		this.context = options.context;
		this.state = options.state;

		this.init();
	}

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

	$.async = {
		version: "1.0.0",
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
