var ContextualManager = function() {
	var references = {
		constructor: [],
		element: [],
		watcher: []
	};

	this.set = function( type, parameters ) {
		return references[ type ].push( parameters ) - 1;
	},
	this.update = function( options ) {
		return references[ options.reference ][ options.key ][ options.parameter ] = options.value;
	},
	this.get = function( type, key ) {
		return references[ type ][ key ];
	}
};

