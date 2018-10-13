( function() {
	window.async = null;
	window.server = null;
	window.spy = null;
	window.started = false;

	function test( path ) {
		return "../test" + path;
	}

	requirejs.config( {
		baseUrl: "../src",
		paths: {
			"async": "async",
			"jquery": test( "/lib/jquery/jquery" ),
			"qunit": test( "/lib/qunit/qunit" ),
			"sinon": test( "/lib/sinon/sinon" ),
			"unit" : test( "/unit" )
		}
	} );

	requirejs( [
		test( "/unit/form-elements" )
	] );
} )();
