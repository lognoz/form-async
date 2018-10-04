define( [
	"./type",
	"./tag"
], function( type, tag ) {
	"use strict";

	return function( selector ) {
		return [ "checkbox", "radio" ].indexOf( type( selector ) ) !== -1 ||
			tag( selector ) === "select" ? "change" : "blur";
	};
} );
