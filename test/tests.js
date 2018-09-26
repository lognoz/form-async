$( document ).ready( function() {
	var server, spy, autosave;

	QUnit.module( 'Test case', {
		beforeEach: function() {
			autosave = $( '.exemple' ).autosave();
			spy = sinon.spy( $, 'ajax' );
			server = sinon.fakeServer.create();
			server.respondWith( 'response' );
		},
		afterEach: function() {
			spy.restore();
			server.restore();
			autosave.destroy();
		}
	} );

	QUnit.test( 'self initialisation with data-action', function( assert ) {
		$( '#simple-field' )
			.val( 'apple' )
			.trigger( 'blur' );

		assert.ok( spy.called );
		assert.ok( $( '#simple-field' ).data( 'autosave-element' ) !== undefined );
		assert.ok( $.ajax.calledWithMatch( { url: '/action/unique-field.html' } ) );
		assert.ok( $.ajax.calledWithMatch( { data: { 'xs_username': 'apple' } } ) );

		server.respond();
	} );

	QUnit.test( 'form initialisation with action', function( assert ) {
		$( '#multiple-fields-name' )
			.val( 'apple' )
			.trigger( 'blur' );

		assert.ok( spy.called );
		assert.ok( $( '#multiple-fields-name' ).data( 'autosave-element' ) !== undefined );
		assert.ok( $.ajax.calledWithMatch( { url: '/action/multiple-fields.html' } ) );
		assert.ok( $.ajax.calledWithMatch( { data: { 'xs_name': 'apple' } } ) );

		server.respond();

		$( '#multiple-fields-phone' )
			.val( 'orange' )
			.trigger( 'blur' );

		assert.ok( spy.called );
		assert.ok( $( '#multiple-fields-phone' ).data( 'autosave-element' ) !== undefined );
		assert.ok( $.ajax.calledWithMatch( { url: '/action/multiple-fields.html' } ) );
		assert.ok( $.ajax.calledWithMatch( { data: { 'xs_phone': 'orange' } } ) );

		server.respond();
	} );

	QUnit.test( 'form initialisation with overwriting action', function( assert ) {
		$( '#overwrite-action-city' )
			.val( 'avocado' )
			.trigger( 'blur' );

		assert.ok( spy.called );
		assert.ok( $( '#overwrite-action-city' ).data( 'autosave-element' ) !== undefined );
		assert.ok( $.ajax.calledWithMatch( { url: '/action/multiple-fields.html' } ) );
		assert.ok( $.ajax.calledWithMatch( { data: { 'xs_city': 'avocado' } } ) );

		server.respond();

		$( '#overwrite-action-province' )
			.val( 'blueberrie' )
			.trigger( 'blur' );

		assert.ok( spy.called );
		assert.ok( $( '#overwrite-action-province' ).data( 'autosave-element' ) !== undefined );
		assert.ok( $.ajax.calledWithMatch( { url: '/action/overwrite-action.html' } ) );
		assert.ok( $.ajax.calledWithMatch( { data: { 'xs_province': 'blueberrie' } } ) );

		server.respond();
	} );

	QUnit.test( 'checkbox list', function( assert ) {
		$( '#checkbox-bike' ).trigger( 'click' );
		server.respond();

		assert.ok( spy.called );
		assert.ok( $( '#checkbox-bike' ).data( 'autosave-element' ) !== undefined );
		assert.ok( $.ajax.calledWithMatch( { url: '/action/checkbox.html' } ) );
		assert.ok( $.ajax.calledWithMatch( { data: { 'xs_vehicule': [ 'bike' ] } } ) );

		$( '#checkbox-car' ).trigger( 'click' );
		server.respond();

		assert.ok( spy.called );
		assert.ok( $( '#checkbox-car' ).data( 'autosave-element' ) !== undefined );
		assert.ok( $.ajax.calledWithMatch( { url: '/action/checkbox.html' } ) );
		assert.ok( $.ajax.calledWithMatch( { data: { 'xs_vehicule': [ 'bike', 'car' ] } } ) );

		$( '#checkbox-bike' ).trigger( 'click' );
		server.respond();

		assert.ok( spy.called );
		assert.ok( $.ajax.calledWithMatch( { data: { 'xs_vehicule': [ 'car' ] } } ) );
	} );

	QUnit.test( 'radio list', function( assert ) {
		$( '#radio-male' ).trigger( 'click' );
		server.respond();

		assert.ok( spy.called );
		assert.ok( $( '#radio-male' ).data( 'autosave-element' ) !== undefined );
		assert.ok( $.ajax.calledWithMatch( { url: '/action/radio.html' } ) );
		assert.ok( $.ajax.calledWithMatch( { data: { 'xs_gender': 'Male' } } ) );

		$( '#radio-female' ).trigger( 'click' );
		server.respond();

		assert.ok( spy.called );
		assert.ok( $( '#radio-female' ).data( 'autosave-element' ) !== undefined );
		assert.ok( $.ajax.calledWithMatch( { url: '/action/radio.html' } ) );
		assert.ok( $.ajax.calledWithMatch( { data: { 'xs_gender': 'Female' } } ) );

		$( '#radio-other' ).trigger( 'click' );
		server.respond();

		assert.ok( spy.called );
		assert.ok( $( '#radio-other' ).data( 'autosave-element' ) !== undefined );
		assert.ok( $.ajax.calledWithMatch( { url: '/action/radio.html' } ) );
		assert.ok( $.ajax.calledWithMatch( { data: { 'xs_gender': 'Other' } } ) );
	} );

	QUnit.test( 'select', function( assert ) {
		$( '#select-car' ).val( 'audi' );
		$( '#select-car' ).trigger( 'change' );

		assert.ok( spy.called );
		assert.ok( $( '#select-car' ).data( 'autosave-element' ) !== undefined );
		assert.ok( $.ajax.calledWithMatch( { url: '/action/select.html' } ) );
		assert.ok( $.ajax.calledWithMatch( { data: { 'xs_car': 'audi' } } ) );

		server.respond();
	} );

	QUnit.test( 'select with multiple attribute', function( assert ) {
		$( '#select-multiple-car [value="audi"]' ).attr( 'selected', true );
		$( '#select-multiple-car [value="volvo"]' ).attr( 'selected', true );
		$( '#select-multiple-car' ).trigger( 'change' );

		assert.ok( spy.called );
		assert.ok( $( '#select-car' ).data( 'autosave-element' ) !== undefined );
		assert.ok( $.ajax.calledWithMatch( { url: '/action/select-multiple.html' } ) );
		assert.ok( $.ajax.calledWithMatch( { data: { 'xs_car': [ 'volvo', 'audi' ] } } ) );

		server.respond();
	} );

	QUnit.test( 'send inputs as a group', function( assert ) {
		$( '#group-password' )
			.val( 'orange' )
			.trigger( 'blur' );

		assert.ok( spy.called );
		assert.ok( $( '#group-password' ).data( 'autosave-element' ) !== undefined );
		assert.ok( $.ajax.calledWithMatch( { url: '/action/group.html' } ) );
		assert.ok( $.ajax.calledWithMatch( {
			data: { 'xs_password': 'orange', 'xs_redirection': 'index.html' }
		} ) );

		server.respond();
	} );

	QUnit.test( 'contenteditable', function( assert ) {
		$( '#contenteditable' )
			.html( 'mango' )
			.trigger( 'blur' );

		assert.ok( spy.called );
		assert.ok( $( '#contenteditable' ).data( 'autosave-element' ) !== undefined );
		assert.ok( $.ajax.calledWithMatch( { url: '/action/contenteditable.html' } ) );
		assert.ok( $.ajax.calledWithMatch( { data: { 'xs_content': 'mango' } } ) );

		server.respond();
	} );

	QUnit.test( 'complexe name', function( assert ) {
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

	QUnit.module( 'Advanced Options', {
		beforeEach: function() {
			spy = sinon.spy( $, 'ajax' );
			server = sinon.fakeServer.create();
			autosave = $( '.exemple' ).autosave( {
				before: function( request ) {
					if ( request.data.xs_username === 'cantaloupe' ) {
						request.abort();
					}
				},
				success: function( response, request ) {
					if ( response === 'redirect' ) {
						return request.fail( request );
					}

					$( this ).addClass( 'success' );
				},
				fail: function( request ) {
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
			autosave.destroy();
		}
	} );

	QUnit.test( 'before function', function( assert ) {
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

	QUnit.test( 'success function', function( assert ) {
		$( '#simple-field' )
			.val( 'clementine' )
			.trigger( 'blur' );

		server.respondWith( 'success' );
		server.respond();

		assert.ok( $( '#simple-field' ).hasClass( 'success' ) );
	} );

	QUnit.test( 'fake a fail response by redirecting', function( assert ) {
		$( '#simple-field' )
			.val( 'durian' )
			.trigger( 'blur' );

		server.respondWith( 'redirect' );
		server.respond();

		assert.ok( $( '#simple-field' ).hasClass( 'fail' ) );
	} );

	QUnit.test( 'fail function', function( assert ) {
		$( '#simple-field' )
			.val( 'durian' )
			.trigger( 'blur' );

		server.respondWith( [ 404, {}, '' ] );
		server.respond();

		assert.ok( $( '#simple-field' ).hasClass( 'fail' ) );
	} );

	QUnit.test( 'retry link', function( assert ) {
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

	QUnit.test( 'destroy', function( assert ) {
		autosave.destroy();

		assert.ok( $( '#simple-field' ).data( 'autosave-element' ) === undefined );
		assert.ok( $( '#simple-field' ).data( 'previous-state' ) === undefined );
		assert.ok( $( '#simple-field' ).data( 'autosave' ) === undefined );

		$( '#simple-field' )
			.val( 'chili pepper' )
			.trigger( 'blur' );

		assert.ok( !spy.called );
	} );
} );
