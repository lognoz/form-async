QUnit.module( "functionalities", {
	beforeEach: function() {
		spy = sinon.spy( $, "ajax" );
		server = sinon.fakeServer.create();
		server.respondWith( "response" );
	},
	afterEach: function() {
		spy.restore();
		server.restore();
	}
} );

QUnit.test( "retry", function( assert ) {
	assert.expect( 4 );

	$( ".exemple" ).async( {
		error: function( request ) {
			$( this ).addClass( "error" );

			$( "#test-case-retry" ).on( "click", function() {
				request.retry();
			} );
		},
		success: function( response, request ) {
			$( this ).removeClass( "error" );
		}
	} );

	$( "#simple-field" )
		.val( "strawberries" )
		.trigger( "blur" );

	server.respondWith( [ 404, {}, "" ] );
	server.respond();

	assert.ok( $( "#simple-field" ).hasClass( "error" ) );
	assert.ok( $.ajax.calledWithMatch( { data: { "xs_username": "strawberries" } } ) );

	$( "#test-case-retry" ).trigger( "click" );
	server.respondWith( "success" );
	server.respond();

	assert.ok( $( "#simple-field" ).hasClass( "error" ) === false );
	assert.ok( $.ajax.calledWithMatch( { data: { "xs_username": "strawberries" } } ) );
} );
