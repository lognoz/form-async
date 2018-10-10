$( document ).ready( function() {
	var server, spy, async;

	QUnit.module( 'Autosave functionalities', {
		beforeEach: function() {
			async = $( '.exemple' ).async();
			spy = sinon.spy( $, 'ajax' );
			server = sinon.fakeServer.create();
			server.respondWith( 'response' );
		},
		afterEach: function() {
			spy.restore();
			server.restore();
			async.destroy();
		}
	} );

	QUnit.test( 'Basic requirements', function( assert ) {
		assert.expect( 34 );

		var form = $( '.exemple' ),
			elements = {
				'simple-field': true,
				'multiple-fields-name': true,
				'multiple-fields-phone': true,
				'overwrite-action-city': true,
				'overwrite-action-province': true,
				'checkbox-bike': true,
				'checkbox-car': true,
				'radio-male': true,
				'radio-female': true,
				'radio-other': true,
				'select-car': true,
				'select-multiple-car': true,
				'group-password': true,
				'group-redirection': true,
				'contenteditable': true,
				'checkbox-complexe-name-bike': true,
				'checkbox-complexe-name-car': true,
				'checkbox-complexe-name-walk': true,
				'address-disabled-field': false,
				'city-disabled-field': false,
				'reset-disabled-field': false,
				'submit-disabled-field': false,
				'image-disabled-field': false
			};

		$.each( elements, function( target, expected ) {
			assert.ok(
				( $( '#' + target ).data( 'async-element' ) !== undefined ) === expected
			);
		} );

		$.each( form, function( index, target ) {
			assert.ok( $( target ).data( 'async' ) !== undefined );
		} );
	} );


	QUnit.test( 'Self initialisation', function( assert ) {
		assert.expect( 3 );

		$( '#simple-field' )
			.val( 'apple' )
			.trigger( 'blur' );

		assert.ok( spy.called );
		assert.ok( $.ajax.calledWithMatch( { url: '/action/unique-field.html' } ) );
		assert.ok( $.ajax.calledWithMatch( { data: { 'xs_username': 'apple' } } ) );

		server.respond();
	} );

	QUnit.test( 'Simple form', function( assert ) {
		assert.expect( 6 );

		$( '#multiple-fields-name' )
			.val( 'apple' )
			.trigger( 'blur' );

		assert.ok( spy.called );
		assert.ok( $.ajax.calledWithMatch( { url: '/action/multiple-fields.html' } ) );
		assert.ok( $.ajax.calledWithMatch( { data: { 'xs_name': 'apple' } } ) );

		server.respond();

		$( '#multiple-fields-phone' )
			.val( 'orange' )
			.trigger( 'blur' );

		assert.ok( spy.called );
		assert.ok( $.ajax.calledWithMatch( { url: '/action/multiple-fields.html' } ) );
		assert.ok( $.ajax.calledWithMatch( { data: { 'xs_phone': 'orange' } } ) );

		server.respond();
	} );

	QUnit.test( 'Overwriting action', function( assert ) {
		assert.expect( 6 );

		$( '#overwrite-action-city' )
			.val( 'avocado' )
			.trigger( 'blur' );

		assert.ok( spy.called );
		assert.ok( $.ajax.calledWithMatch( { url: '/action/multiple-fields.html' } ) );
		assert.ok( $.ajax.calledWithMatch( { data: { 'xs_city': 'avocado' } } ) );

		server.respond();

		$( '#overwrite-action-province' )
			.val( 'blueberrie' )
			.trigger( 'blur' );

		assert.ok( spy.called );
		assert.ok( $.ajax.calledWithMatch( { url: '/action/overwrite-action.html' } ) );
		assert.ok( $.ajax.calledWithMatch( { data: { 'xs_province': 'blueberrie' } } ) );

		server.respond();
	} );

	QUnit.test( 'Checkbox', function( assert ) {
		assert.expect( 8 );

		$( '#checkbox-bike' ).trigger( 'click' );
		server.respond();

		assert.ok( spy.called );
		assert.ok( $.ajax.calledWithMatch( { url: '/action/checkbox.html' } ) );
		assert.ok( $.ajax.calledWithMatch( { data: { 'xs_vehicule': [ 'bike' ] } } ) );

		$( '#checkbox-car' ).trigger( 'click' );
		server.respond();

		assert.ok( spy.called );
		assert.ok( $.ajax.calledWithMatch( { url: '/action/checkbox.html' } ) );
		assert.ok( $.ajax.calledWithMatch( { data: { 'xs_vehicule': [ 'bike', 'car' ] } } ) );

		$( '#checkbox-bike' ).trigger( 'click' );
		server.respond();

		assert.ok( spy.called );
		assert.ok( $.ajax.calledWithMatch( { data: { 'xs_vehicule': [ 'car' ] } } ) );
	} );

	QUnit.test( 'Radio', function( assert ) {
		assert.expect( 9 );

		$( '#radio-male' ).trigger( 'click' );
		server.respond();

		assert.ok( spy.called );
		assert.ok( $.ajax.calledWithMatch( { url: '/action/radio.html' } ) );
		assert.ok( $.ajax.calledWithMatch( { data: { 'xs_gender': 'Male' } } ) );

		$( '#radio-female' ).trigger( 'click' );
		server.respond();

		assert.ok( spy.called );
		assert.ok( $.ajax.calledWithMatch( { url: '/action/radio.html' } ) );
		assert.ok( $.ajax.calledWithMatch( { data: { 'xs_gender': 'Female' } } ) );

		$( '#radio-other' ).trigger( 'click' );
		server.respond();

		assert.ok( spy.called );
		assert.ok( $.ajax.calledWithMatch( { url: '/action/radio.html' } ) );
		assert.ok( $.ajax.calledWithMatch( { data: { 'xs_gender': 'Other' } } ) );
	} );

	QUnit.test( 'Select', function( assert ) {
		assert.expect( 3 );

		$( '#select-car' ).val( 'audi' );
		$( '#select-car' ).trigger( 'change' );

		assert.ok( spy.called );
		assert.ok( $.ajax.calledWithMatch( { url: '/action/select.html' } ) );
		assert.ok( $.ajax.calledWithMatch( { data: { 'xs_car': 'audi' } } ) );

		server.respond();
	} );

	QUnit.test( 'Select with multiple attribute', function( assert ) {
		assert.expect( 3 );

		$( '#select-multiple-car [value="audi"]' ).attr( 'selected', true );
		$( '#select-multiple-car [value="volvo"]' ).attr( 'selected', true );
		$( '#select-multiple-car' ).trigger( 'change' );

		assert.ok( spy.called );
		assert.ok( $.ajax.calledWithMatch( { url: '/action/select-multiple.html' } ) );
		assert.ok( $.ajax.calledWithMatch( { data: { 'xs_car': [ 'volvo', 'audi' ] } } ) );

		server.respond();
	} );

	QUnit.test( 'Send inputs as a group', function( assert ) {
		assert.expect( 3 );

		$( '#group-password' )
			.val( 'orange' )
			.trigger( 'blur' );

		assert.ok( spy.called );
		assert.ok( $.ajax.calledWithMatch( { url: '/action/group.html' } ) );
		assert.ok( $.ajax.calledWithMatch( {
			data: { 'xs_password': 'orange', 'xs_redirection': 'index.html' }
		} ) );

		server.respond();
	} );

	QUnit.test( 'Contenteditable', function( assert ) {
		assert.expect( 3 );

		$( '#contenteditable' )
			.html( 'mango' )
			.trigger( 'blur' );

		assert.ok( spy.called );
		assert.ok( $.ajax.calledWithMatch( { url: '/action/contenteditable.html' } ) );
		assert.ok( $.ajax.calledWithMatch( { data: { 'xs_content': 'mango' } } ) );

		server.respond();
	} );

	QUnit.test( 'Complexe name', function( assert ) {
		assert.expect( 6 );

		$( '#checkbox-complexe-name-bike' ).trigger( 'click' );
		server.respond();

		assert.ok( spy.called );
		assert.ok( $.ajax.calledWithMatch( {
			data: { 'xs_vehicule[][data]': [ 'bike' ] }
		} ) );

		$( '#checkbox-complexe-name-car' ).trigger( 'click' );
		server.respond();

		assert.ok( spy.called );
		assert.ok( $.ajax.calledWithMatch( {
			data: { 'xs_vehicule[][data]': [ 'bike', 'car' ] }
		} ) );

		$( '#checkbox-complexe-name-walk' ).trigger( 'click' );
		server.respond();

		assert.ok( spy.called );
		assert.ok( $.ajax.calledWithMatch( {
			data: { 'xs_vehicule[][][][data]': 'walk' }
		} ) );
	} );

	QUnit.module( 'Autosave advanced options', {
		beforeEach: function() {
			spy = sinon.spy( $, 'ajax' );
			server = sinon.fakeServer.create();
			async = $( '.exemple' ).async( {
				before: function( request ) {
					if ( request.data.xs_username === 'cantaloupe' ) {
						request.abort();
					}
				},
				success: function( response, request ) {
					if ( response === 'redirect' ) {
						return request.error( request );
					}

					$( this ).addClass( 'success' );
				},
				error: function( request ) {
					$( this ).addClass( 'fail' );

					$( '#test-case-retry' ).on( 'click', function() {
						request.retry();
					} );
				}
			} );
		},
		afterEach: function() {
			spy.restore();
			server.restore();
		}
	} );

	QUnit.test( 'Before function', function( assert ) {
		assert.expect( 3 );

		$( '#simple-field' )
			.val( 'cantaloupe' )
			.trigger( 'blur' );

		assert.ok( !spy.called );

		$( '#simple-field' )
			.val( 'carambola' )
			.trigger( 'blur' );

		assert.ok( spy.called );
		assert.ok( $.ajax.calledWithMatch( { data: { 'xs_username': 'carambola' } } ) );
	} );

	QUnit.test( 'Success function', function( assert ) {
		assert.expect( 1 );

		$( '#simple-field' )
			.val( 'clementine' )
			.trigger( 'blur' );

		server.respondWith( 'success' );
		server.respond();

		assert.ok( $( '#simple-field' ).hasClass( 'success' ) );
	} );

	QUnit.test( 'Fake a fail response by redirecting', function( assert ) {
		assert.expect( 1 );

		$( '#simple-field' )
			.val( 'durian' )
			.trigger( 'blur' );

		server.respondWith( 'redirect' );
		server.respond();

		assert.ok( $( '#simple-field' ).hasClass( 'fail' ) );
	} );

	QUnit.test( 'Fail function', function( assert ) {
		assert.expect( 1 );

		$( '#simple-field' )
			.val( 'durian' )
			.trigger( 'blur' );

		server.respondWith( [ 404, {}, '' ] );
		server.respond();

		assert.ok( $( '#simple-field' ).hasClass( 'fail' ) );
	} );

	QUnit.test( 'Retry link', function( assert ) {
		assert.expect( 2 );

		$( '#simple-field' )
			.val( 'strawberries' )
			.trigger( 'blur' );

		server.respondWith( [ 404, {}, '' ] );
		server.respond();
		assert.ok( $.ajax.calledWithMatch( { data: { 'xs_username': 'strawberries' } } ) );

		$( '#test-case-retry' ).trigger( 'click' );
		server.respondWith( 'success' );
		server.respond();
		assert.ok( $( '#simple-field' ).hasClass( 'success' ) );
	} );

	QUnit.test( 'Destroy', function( assert ) {
		assert.expect( 4 );

		async.destroy();

		assert.ok( $( '#simple-field' ).data( 'autosave-element' ) === undefined );
		assert.ok( $( '#simple-field' ).data( 'previous-state' ) === undefined );
		assert.ok( $( '#simple-field' ).data( 'autosave' ) === undefined );

		$( '#simple-field' )
			.val( 'chili pepper' )
			.trigger( 'blur' );

		assert.ok( !spy.called );
	} );
} );
