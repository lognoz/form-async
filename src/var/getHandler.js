define( [
	'./getType',
	'./getTag'
], function( getType, getTag ) {
	'use strict';

	return function( selector ) {
		return [ 'checkbox', 'radio' ].indexOf( getType( selector ) ) !== -1 ||
			getTag( selector ) === 'select' ? 'change' : 'blur';
	};
} );
