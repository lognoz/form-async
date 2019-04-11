( function() {
	requirejs.config( {
		baseUrl: "../src",
		paths: {
			"jquery": "../lib/jquery/jquery",
			"qunit": "../lib/qunit/qunit",
			"sinon": "../lib/sinon/sinon",
			"unit": "../test",
		}
	} );

	// Load test environment
	require( [ "qunit" ], function( QUnit ) {
		QUnit.start();
	} );

	// Load test modules
	require( [
		"unit/core",
		"unit/events",
		"unit/callbacks"
	] );
} )();
