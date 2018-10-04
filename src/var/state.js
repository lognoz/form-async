define( [
	"./type",
], function( type ) {
	"use strict";

	return function( selector ) {
		return [ "checkbox", "radio" ].indexOf( type( selector ) ) !== -1 ?
			selector.checked : selector.value || selector.innerHTML;
	};
} );
