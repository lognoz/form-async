module.exports = function( grunt ) {
	var regex = {
		defineEnding:    /\}\s*?\);[^}\w]*$/,
		defineWrapper:   /define\([^{]*?{\s*(?:("|')use strict\1(?:;|))?/,
		functionReturn:  /\s*return\s+[^\}]+(\}\s*?\);[^\w\}]*)$/,
		variableDefine:  /define\([\w\W]*?return/,
		variableName:    /var\/([\w-]+)/,
		version:         /@version/g,
		wrapper:         /[\x20\t]*\/\/ @code\n(?:[\x20\t]*\/\/[^\n]+\n)*/,
		years:           /@years/g
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

	function format( content ) {
		content = content.trim();
		return content !== '' ? "\n\t" + content : content;
	}

	function build( name, path, content ) {
		switch( true ) {
			case name.indexOf( 'src/var/' ) == 0:
				return convertToVariable( name, content );
				break;

			case name.indexOf( 'src/core.js' ) !== 0:
				return convertToStatement( content );
				break;

			default:
				return '';
		};
	}

	grunt.registerTask('build', [], function () {
		grunt.config('requirejs', {
			compile: {
				options: {
					baseUrl: '.',
					exclude: [ 'jquery' ],
					include: [ 'src/core.js' ],
					paths: {
						jquery: 'node_modules/jquery/dist/jquery',
					},

					//Additional processing
					onBuildWrite: build,

					// Allow strict mode
					useStrict: true,

					// Avoid breaking semicolons
					skipSemiColonInsertion: true,

					// No minification
					optimize: 'none',

					// Write file
					out: function( code ) {
						var wrapper = getWrapper();
						var content = ( wrapper.start + "\t" + code.trim() + "\n" + wrapper.end )
							.replace( regex.version, '1.0.0' )
							.replace( regex.years, grunt.template.today( 'yyyy' ) );

						grunt.file.write( 'dist/form-async.js', content );
					}
				}
			}
		} );

		grunt.loadNpmTasks('grunt-contrib-requirejs');
		grunt.task.run( 'requirejs' );
	} );
}
