define( [
	"jquery",
	"qunit",
	"sinon",
	"async"
], function( $, QUnit, sinon ) {
	if ( started !== true ) {
		QUnit.start();
		started = true;
	}

	return {
		beforeEach: function() {
			async = $( ".exemple" ).async();
			spy = sinon.spy( $, "ajax" );
			server = sinon.fakeServer.create();
			server.respondWith( "response" );
		},
		afterEach: function() {
			spy.restore();
			server.restore();
		}
	};
} );
