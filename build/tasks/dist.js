module.exports = function( grunt ) {
	var package = grunt.file.readJSON( 'package.json' );

	function compare_size() {
		return {
			files: [ 'dist/form-async.min.js', 'dist/form-async.js' ],
			options: {
				compress: {
					gz: function( contents ) {
						return require( 'gzip-js' ).zip( contents, {} ).length;
					}
				},
				cache: 'build/.sizecache.json'
			}
		};
	}

	function uglify() {
		return {
			options: {
				compress: {
					unsafe: true
				},
				screwIE8: false,
				banner: '/*! ' + package.name + ' v' + package.version + ' | ' +
					'(c) Marc-Antoine Loignon and other contributors */'
			},
			build: {
				'dist/form-async.min.js': 'dist/form-async.js'
			}
		};
	}

	grunt.registerTask('dist', [], function () {
		grunt.config( 'uglify', uglify() );
		grunt.config( 'compare_size', compare_size() );
		grunt.task.run( [ 'uglify', 'compare_size' ] );
	} );
};
