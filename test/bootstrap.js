( function() {
	requirejs.config( {
		baseUrl: "../../../src",
		paths: {
			"jquery": "../lib/jquery/jquery",
			"qunit": "../lib/qunit/qunit",
			"sinon": "../lib/sinon/sinon",
			"unit" : "../test/unit"
		}
	} );

	// Find the script element
	var scripts = document.getElementsByTagName( "script" );
	var script = scripts[ scripts.length - 1 ];

	// Read the modules
	var module = script.getAttribute( "data-modules" );

	// Load test environment
	require( [ "qunit" ], function( QUnit ) {
		QUnit.start();
	} );

	// Load test module based on data attributes
	require( [
		"unit/" + module + "/core"
	] );
} )();
