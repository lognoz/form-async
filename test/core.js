define( [
	"jquery",
	"qunit",
	"sinon",
	"async"
], function( $, QUnit, sinon ) {

	QUnit.module( "core" );

	QUnit.test( "basic requirement", function( assert ) {
		assert.expect( 2 );
		assert.ok( $.async !== undefined, "$: async" );
		assert.ok( $.fn.async !== undefined, "$: fn.async" );
	} );

	$.each( {
		"unique field": {
			"selector": $( ".exemple" )[ 0 ],
			"action": "/action/unique-field.html",
			"elements": 1
		},
		"multiple fields": {
			"selector": $( ".exemple" )[ 1 ],
			"action": "/action/multiple-fields.html",
			"elements": 2
		},
		"multiple fields with overwriting": {
			"selector": $( ".exemple" )[ 2 ],
			"action": "/action/multiple-fields.html",
			"elements": 2
		},
		"checkbox": {
			"selector": $( ".exemple" )[ 3 ],
			"action": "/action/checkbox.html",
			"elements": 2
		},
		"radio": {
			"selector": $( ".exemple" )[ 4 ],
			"action": "/action/radio.html",
			"elements": 3
		},
		"select": {
			"selector": $( ".exemple" )[ 5 ],
			"action": "/action/select.html",
			"elements": 1
		},
		"select with multiple attribute": {
			"selector": $( ".exemple" )[ 6 ],
			"action": "/action/select-multiple.html",
			"elements": 1
		},
		"group": {
			"selector": $( ".exemple" )[ 7 ],
			"action": "/action/group.html",
			"elements": 2
		},
		"contenteditable": {
			"selector": $( ".exemple" )[ 8 ],
			"action": "/action/contenteditable.html",
			"elements": 1
		},
		"complexe name": {
			"selector": $( ".exemple" )[ 9 ],
			"action": "/action/complexe-name.html",
			"elements": 3
		},
		"disabled": {
			"selector": $( ".exemple" )[ 10 ],
			"action": "/action/disabled.html",
			"elements": 0
		}
	}, function( type, options ) {
		QUnit.test( "markup structure: " + type, function( assert ) {
			assert.expect( 3 + ( options.elements * 2 ) );
			var selector = $( options.selector ),
				construct = selector.async(),
				async = selector.data( "async" );

			assert.equal( async.form, options.selector );
			assert.equal( async.action, options.action );
			assert.equal( async.elements.length, options.elements );

			$.each( async.elements, function( index, options ) {
				selector = $( options.selector );
				assert.equal( selector.data( "async-element" ), index );
				assert.ok( selector.data( "previous-state" ) !== undefined );
			} );
		} );
	} );

	$.each( {
		"disabled attribute": $( "#address-disabled-field" ),
		"disabled async attribute": $( "#city-disabled-field" ),
		"reset input": $( "#reset-disabled-field" ),
		"submit input": $( "#submit-disabled-field" ),
		"image input": $( "#image-disabled-field" )
	}, function( type, selector ) {
		QUnit.test( "disabled inputs: " + type, function( assert ) {
			assert.expect( 2 );
			assert.equal( selector.data( "async-element" ), undefined );
			assert.equal( selector.data( "previous-state" ), undefined );
		} );
	} );
} );
