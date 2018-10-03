define( [
	'./getType',
], function( getType ) {
	'use strict';

	return function( selector ) {
		return [ 'checkbox', 'radio' ].indexOf( getType( selector ) ) !== -1 ?
			selector.checked : selector.value || selector.innerHTML;
	};
} );
