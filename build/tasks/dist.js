module.exports = function( grunt ) {
	var package = grunt.file.readJSON( 'package.json' );

	function getBuild() {
		return {
			'dist/form-async.min.js': 'dist/form-async.js'
		};
	}

	function getCompareSize() {
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

	function getUglify() {
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
				files: getBuild()
			}
		};
	}

	grunt.registerTask('dist', [], function () {
		grunt.config( 'uglify', getUglify() );
		grunt.config( 'compare_size', getCompareSize() );
		grunt.task.run( [ 'uglify', 'compare_size' ] );
	} );
};
