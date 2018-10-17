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
	var modules = script.getAttribute( "data-modules" );

	// Load test modules based on data attributes
	require( [
		"unit/" + modules + "/core"
	] );
} )();
