define( function() {
	"use strict";

	return function( obj ) {
		return typeof obj === "function" && typeof obj.nodeType !== "number";
	};
} );
