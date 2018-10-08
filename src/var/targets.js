define( [
	"jquery",
], function( $ ) {
	"use strict";

	return function( form ) {
		var valid = "select, input, textarea, [contentEditable]";
		if ( form.children.length === 0 && $( form ).is( valid ) ) {
			return [ form ];
		} else {
			return $( form )
				.find( valid )
				.not( ":submit, :reset, :image, :disabled, [data-disabled-autosave]" );
		}
	};
} );
