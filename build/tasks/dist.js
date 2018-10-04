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
			all: {
				files: {
					"dist/form-async.min.js": "dist/form-async.js"
				},
				options: {
					banner: '/*! Form Async - v' + package.version + ' | ' +
						'(c) Form Async and other contributors */',
					compress: {
						unsafe: true
					},
					preserveComments: false,
					screwIE8: false,
					sourceMap: true,
					sourceMapName: "dist/form-async.min.map"
				}
			}
		};
	}

	grunt.registerTask('dist', [], function () {
		grunt.config( 'uglify', uglify() );
		grunt.config( 'compare_size', compare_size() );
		grunt.task.run( [ 'uglify', 'compare_size' ] );
	} );
};
