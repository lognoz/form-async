define( [
	'jquery',
], function( $ ) {
	'use strict';

	return function( reference, selector ) {
		if ( [ 'input', 'select', 'textarea' ].indexOf( reference.tag ) !== -1 &&
			( reference.type !== 'checkbox' || selector.checked ) ) {
			return $( selector ).val();
		} else {
			return $( selector ).html();
		}
	};
} );
