define( [
	"jquery",
	"qunit",
	"sinon",
	"async"
], function( $, QUnit, sinon ) {
	QUnit.module( "core: extensions" );

	QUnit.test( "$.async", function( assert ) {
		assert.expect( 1 );

		assert.ok( $.async !== undefined );
	} );

	QUnit.test( "$.fn.async", function( assert ) {
		assert.expect( 1 );

		assert.ok( $.fn.async !== undefined );
	} );

	QUnit.module( "core: attributes" );

	QUnit.test( "async", function( assert ) {
		assert.expect( 11 );

		$.each( $( ".exemple" ), function( index, target ) {
			assert.ok( $( target ).data( "async" ) !== undefined );
		} );
	} );

	QUnit.test( "async-element", function( assert ) {
		assert.expect( 23 );

		var elements = {
			"simple-field": true,
			"multiple-fields-name": true,
			"multiple-fields-phone": true,
			"overwrite-action-city": true,
			"overwrite-action-province": true,
			"checkbox-bike": true,
			"checkbox-car": true,
			"radio-male": true,
			"radio-female": true,
			"radio-other": true,
			"select-car": true,
			"select-multiple-car": true,
			"group-password": true,
			"group-redirection": true,
			"contenteditable": true,
			"checkbox-complexe-name-bike": true,
			"checkbox-complexe-name-car": true,
			"checkbox-complexe-name-walk": true,
			"address-disabled-field": false,
			"city-disabled-field": false,
			"reset-disabled-field": false,
			"submit-disabled-field": false,
			"image-disabled-field": false
		};

		$.each( elements, function( target, expected ) {
			assert.ok(
				( $( "#" + target ).data( "async-element" ) !== undefined ) === expected
			);
		} );
	} );
} );
