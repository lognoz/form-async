/*!
 * JavaScript Autosave v@version
 * https://github.com/lognoz/js-autosave
 *
 * Copyright 2018, @years Marc-Antoine Loignon
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

	// @code
} );
