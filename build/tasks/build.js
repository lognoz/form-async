module.exports = function( grunt ) {
	var regex = {
		defineEnding:    /\}\s*?\);[^}\w]*$/,
		defineWrapper:   /define\([^{]*?{\s*(?:("|')use strict\1(?:;|))?/,
		functionReturn:  /\s*return\s+[^\}]+(\}\s*?\);[^\w\}]*)$/,
		variableDefine:  /define\([\w\W]*?return/,
		variableName:    /var\/([\w-]+)/,
		version:         /@VERSION/g,
		wrapper:         /[\x20\t]*\/\/ @CODE\n(?:[\x20\t]*\/\/[^\n]+\n)*/,
		years:           /@YEARS/g
	};

	function convertToStatement( content ) {
		return format(
			content
			.replace( regex.functionReturn, '$1' )
			.replace( regex.defineWrapper, '' )
			.replace( regex.defineEnding, '' )
		);
	}

	function convertToVariable( name, content ) {
		return format(
			content
			.replace( regex.variableDefine, 'var ' + getVariableName( name ) + ' =' )
			.replace( regex.defineEnding, '' )
		);
	}

	function getVariableName( name ) {
		return regex.variableName.exec( name )[ 1 ];
	}

	function getWrapper() {
		var wrapper = grunt.file.read( __dirname + '/../../src/wrapper.js' ).split( regex.wrapper );
		return {
			start: wrapper[0],
			end: wrapper[1]
		};
	}

	function requirejs() {
		var sources = grunt.config.data.build;
		var requirements = {};

		for ( var src in sources ) {
			requirements[ src ] = {
				options: {
					baseUrl: '.',
					exclude: [ 'jquery' ],
					include: [ src ],
					paths: {
						jquery: 'node_modules/jquery/dist/jquery',
					},
					onBuildWrite: build,
					optimize: 'none',
					skipSemiColonInsertion: true,
					useStrict: true,
					out: function( code ) {
						var wrapper = getWrapper();
						grunt.file.write( sources[ src ],
							( wrapper.start + "\t" + code.trim() + "\n" + wrapper.end )
								.replace( regex.version, '1.0.0' )
								.replace( regex.years, grunt.template.today( 'yyyy' ) )
						);
					}
				}
			};
		}

		return requirements;
	}

	function format( content ) {
		content = content.trim();
		return content !== '' ? "\n\t" + content : content;
	}

	function build( name, path, content ) {
		switch( true ) {
			case name.indexOf( 'src/var/' ) == 0:
				return convertToVariable( name, content );
				break;

			default:
				return convertToStatement( content );
		};
	}

	grunt.registerTask('build', [], function () {
		grunt.config( 'requirejs', requirejs() );
		grunt.task.run( 'requirejs' );
	} );
};
