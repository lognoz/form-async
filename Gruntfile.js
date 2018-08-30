module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);

	var gzip = require( "gzip-js" )

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		compare_size: {
			files: [
				"build/quick-autosave.min.js",
				"src/quick-autosave.js"
			],
			options: {
				compress: {
					gz: function(contents) {
						return gzip.zip(contents, {}).length;
					}
				},
				cache: "build/.sizecache.json"
			}
		},
		uglify: {
			options: {
				compress: {
					unsafe: true
				},
				screwIE8: false,
				banner: "/*! <%= pkg.name %> v<%= pkg.version %> | (c) Marc-Antoine Loignon and other contributors */\n",
			},
			build: {
				files: {
					'build/quick-autosave.min.js': 'src/quick-autosave.js',
					'build/quick-autosave-<%= pkg.version %>.min.js': 'src/quick-autosave.js'
				}
			}
		}
	});

	grunt.registerTask('test', ['uglify', 'compare_size']);
	grunt.registerTask('default', ['test']);
};
