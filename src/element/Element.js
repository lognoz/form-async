define( [
	"jquery"
], function( $ ) {
	"use strict";

	function Element( selector ) {
		this.selector = selector;
	}

	Element.prototype = {
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

	return Element;
} );
