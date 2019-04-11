define( [
	"jquery",
	"qunit",
	"sinon",
	"async"
], function( $, QUnit, sinon ) {

	QUnit.module( "async: events", {
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
	} );

	QUnit.test( "self initialisation", function( assert ) {
		assert.expect( 3 );

		$( "#simple-field" )
			.val( "apple" )
			.trigger( "blur" );

		assert.ok( spy.called );
		assert.ok( $.ajax.calledWithMatch( { url: "/action/unique-field.html" } ) );
		assert.ok( $.ajax.calledWithMatch( { data: { "xs_username": "apple" } } ) );

		server.respond();
	} );

	QUnit.test( "simple form", function( assert ) {
		assert.expect( 6 );

		$( "#multiple-fields-name" )
			.val( "apple" )
			.trigger( "blur" );

		assert.ok( spy.called );
		assert.ok( $.ajax.calledWithMatch( { url: "/action/multiple-fields.html" } ) );
		assert.ok( $.ajax.calledWithMatch( { data: { "xs_name": "apple" } } ) );

		server.respond();

		$( "#multiple-fields-phone" )
			.val( "orange" )
			.trigger( "blur" );

		assert.ok( spy.called );
		assert.ok( $.ajax.calledWithMatch( { url: "/action/multiple-fields.html" } ) );
		assert.ok( $.ajax.calledWithMatch( { data: { "xs_phone": "orange" } } ) );

		server.respond();
	} );

	QUnit.test( "overwriting action", function( assert ) {
		assert.expect( 6 );

		$( "#overwrite-action-city" )
			.val( "avocado" )
			.trigger( "blur" );

		assert.ok( spy.called );
		assert.ok( $.ajax.calledWithMatch( { url: "/action/multiple-fields.html" } ) );
		assert.ok( $.ajax.calledWithMatch( { data: { "xs_city": "avocado" } } ) );

		server.respond();

		$( "#overwrite-action-province" )
			.val( "blueberrie" )
			.trigger( "blur" );

		assert.ok( spy.called );
		assert.ok( $.ajax.calledWithMatch( { url: "/action/overwrite-action.html" } ) );
		assert.ok( $.ajax.calledWithMatch( { data: { "xs_province": "blueberrie" } } ) );

		server.respond();
	} );

	QUnit.test( "checkbox", function( assert ) {
		assert.expect( 8 );

		$( "#checkbox-bike" ).trigger( "click" );
		server.respond();

		assert.ok( spy.called );
		assert.ok( $.ajax.calledWithMatch( { url: "/action/checkbox.html" } ) );
		assert.ok( $.ajax.calledWithMatch( { data: { "xs_vehicule": [ "bike" ] } } ) );

		$( "#checkbox-car" ).trigger( "click" );
		server.respond();

		assert.ok( spy.called );
		assert.ok( $.ajax.calledWithMatch( { url: "/action/checkbox.html" } ) );
		assert.ok( $.ajax.calledWithMatch( { data: { "xs_vehicule": [ "bike", "car" ] } } ) );

		$( "#checkbox-bike" ).trigger( "click" );
		server.respond();

		assert.ok( spy.called );
		assert.ok( $.ajax.calledWithMatch( { data: { "xs_vehicule": [ "car" ] } } ) );
	} );

	QUnit.test( "radio", function( assert ) {
		assert.expect( 9 );

		$( "#radio-male" ).trigger( "click" );
		server.respond();

		assert.ok( spy.called );
		assert.ok( $.ajax.calledWithMatch( { url: "/action/radio.html" } ) );
		assert.ok( $.ajax.calledWithMatch( { data: { "xs_gender": "Male" } } ) );

		$( "#radio-female" ).trigger( "click" );
		server.respond();

		assert.ok( spy.called );
		assert.ok( $.ajax.calledWithMatch( { url: "/action/radio.html" } ) );
		assert.ok( $.ajax.calledWithMatch( { data: { "xs_gender": "Female" } } ) );

		$( "#radio-other" ).trigger( "click" );
		server.respond();

		assert.ok( spy.called );
		assert.ok( $.ajax.calledWithMatch( { url: "/action/radio.html" } ) );
		assert.ok( $.ajax.calledWithMatch( { data: { "xs_gender": "Other" } } ) );
	} );

	QUnit.test( "select", function( assert ) {
		assert.expect( 3 );

		$( "#select-car" ).val( "audi" );
		$( "#select-car" ).trigger( "change" );

		assert.ok( spy.called );
		assert.ok( $.ajax.calledWithMatch( { url: "/action/select.html" } ) );
		assert.ok( $.ajax.calledWithMatch( { data: { "xs_car": "audi" } } ) );

		server.respond();
	} );

	QUnit.test( "select with multiple attribute", function( assert ) {
		assert.expect( 3 );

		$( "#select-multiple-car [value=\"audi\"]" ).attr( "selected", true );
		$( "#select-multiple-car [value=\"volvo\"]" ).attr( "selected", true );
		$( "#select-multiple-car" ).trigger( "change" );

		assert.ok( spy.called );
		assert.ok( $.ajax.calledWithMatch( { url: "/action/select-multiple.html" } ) );
		assert.ok( $.ajax.calledWithMatch( { data: { "xs_car": [ "volvo", "audi" ] } } ) );

		server.respond();
	} );

	QUnit.test( "group", function( assert ) {
		assert.expect( 3 );

		$( "#group-password" )
			.val( "orange" )
			.trigger( "blur" );

		assert.ok( spy.called );
		assert.ok( $.ajax.calledWithMatch( { url: "/action/group.html" } ) );
		assert.ok( $.ajax.calledWithMatch( {
			data: { "xs_password": "orange", "xs_redirection": "index.html" }
		} ) );

		server.respond();
	} );

	QUnit.test( "contenteditable", function( assert ) {
		assert.expect( 3 );

		$( "#contenteditable" )
			.html( "mango" )
			.trigger( "blur" );

		assert.ok( spy.called );
		assert.ok( $.ajax.calledWithMatch( { url: "/action/contenteditable.html" } ) );
		assert.ok( $.ajax.calledWithMatch( { data: { "xs_content": "mango" } } ) );

		server.respond();
	} );

	QUnit.test( "complexe name", function( assert ) {
		assert.expect( 6 );

		$( "#checkbox-complexe-name-bike" ).trigger( "click" );
		server.respond();

		assert.ok( spy.called );
		assert.ok( $.ajax.calledWithMatch( {
			data: { "xs_vehicule[][data]": [ "bike" ] }
		} ) );

		$( "#checkbox-complexe-name-car" ).trigger( "click" );
		server.respond();

		assert.ok( spy.called );
		assert.ok( $.ajax.calledWithMatch( {
			data: { "xs_vehicule[][data]": [ "bike", "car" ] }
		} ) );

		$( "#checkbox-complexe-name-walk" ).trigger( "click" );
		server.respond();

		assert.ok( spy.called );
		assert.ok( $.ajax.calledWithMatch( {
			data: { "xs_vehicule[][][][data]": "walk" }
		} ) );
	} );
} );
