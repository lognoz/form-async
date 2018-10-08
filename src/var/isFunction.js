define( function() {
	"use strict";

	return function isFunction( obj ) {
		return typeof obj === "function" && typeof obj.nodeType !== "number";
	};
} );
