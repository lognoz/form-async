( function() {
	function test( path ) {
		return "../test" + path;
	}

	requirejs.config( {
		baseUrl: "../src",
		paths: {
			"async": "async",
			"jquery": test( "/lib/jquery/jquery" ),
			"qunit": test( "/lib/qunit/qunit" ),
			"sinon": test( "/lib/sinon/sinon" )
		}
	} );

	requirejs( [
		test( "/unit/form-elements" )
	] );
} )();
