define( [
	"jquery",
	"qunit",
	"sinon",
	"async"
], function( $, QUnit, sinon ) {

	function execute() {
		QUnit.test( "before", function( assert ) {
			assert.expect( 3 );

			$.each( {
				"cantaloupe": false,
				"carambola": true,
				"apricot": true
			}, function( value, expected ) {
				$( "#simple-field" )
					.val( value )
					.trigger( "blur" );

				assert.ok( spy.called == expected );
			} );
		} );

		QUnit.test( "success", function( assert ) {
			assert.expect( 3 );

			$.each( {
				"apple": true,
				"carambola": true,
				"error": false
			}, function( content, expected ) {
				$( "#simple-field" )
					.val( content )
					.trigger( "blur" );

				server.respondWith( content );
				server.respond();

				assert.ok( $( "#simple-field" ).hasClass( "success" ) === expected );
			} );
		} );

		QUnit.test( "error", function( assert ) {
			assert.expect( 3 );

			$.each( {
				"success": false,
				"not found": true,
				"error": true
			}, function( response, expected ) {
				$( "#simple-field" )
					.val( response )
					.trigger( "blur" );

				if ( response === "not found"  ) {
					server.respondWith( [ 404, {}, "" ] );
				} else {
					server.respondWith( response );
				}

				server.respond();
				assert.ok( $( "#simple-field" ).hasClass( "error" ) === expected );
			} );
		} );
	}

	var options = {
		before: function( request ) {
			if ( request.data.xs_username === "cantaloupe" ) {
				request.abort();
			}
		},
		success: function( response, request ) {
			$( this ).removeClass( "error" );
			$( this ).removeClass( "success" );

			if ( response !== "error" ) {
				$( this ).addClass( "success" );
			} else {
				request.error()
			}
		},
		error: function( request ) {
			$( this ).addClass( "error" );
		}
	};

	QUnit.module( "callbacks: options", {
		beforeEach: function() {
			spy = sinon.spy( $, "ajax" );
			server = sinon.fakeServer.create();
			async = $( ".exemple" ).async( options );
		},
		afterEach: function() {
			spy.restore();
			server.restore();
		}
	} );

	execute();

	QUnit.module( "callbacks: defaults", {
		beforeEach: function() {
			$.async.defaults = options;
			spy = sinon.spy( $, "ajax" );
			server = sinon.fakeServer.create();
			async = $( ".exemple" ).async();
		},
		afterEach: function() {
			spy.restore();
			server.restore();
		}
	} );

	execute();
} );
