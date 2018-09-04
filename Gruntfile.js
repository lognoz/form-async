module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);

	var gzip = require('gzip-js');
	var travis = process.env.TRAVIS;

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		compare_size: {
			files: [
				'build/js.autosave.min.js',
				'src/js.autosave.js'
			],
			options: {
				compress: {
					gz: function(contents) {
						return gzip.zip(contents, {}).length;
					}
				},
				cache: 'build/.sizecache.json'
			}
		},
		uglify: {
			options: {
				compress: {
					unsafe: true
				},
				screwIE8: false,
				banner: '/*! <%= pkg.name %> v<%= pkg.version %> | ' +
				        '(c) Marc-Antoine Loignon and other contributors */',
			},
			build: {
				files: {
					'build/js.autosave.min.js': 'src/js.autosave.js',
					'build/js.autosave-<%= pkg.version %>.min.js': 'src/js.autosave.js'
				}
			}
		},
		qunit: {
			all: {
				options: {
					urls: [
						'http://localhost:8000/test/index.html?jquery=1.11.1',
						'http://localhost:8000/test/index.html?jquery=1.7.2',
						'http://localhost:8000/test/index.html?jquery=1.8.3',
						'http://localhost:8000/test/index.html?jquery=1.9.1',
						'http://localhost:8000/test/index.html?jquery=2.1.1',
						'http://localhost:8000/test/index.html?jquery=3.0.0'
					]
				}
			}
		},
		connect: {
			server: {
				options: {
					port: 8000,
					base: '.'
				}
			}
		}
	});

	grunt.registerTask('test', ['uglify', 'compare_size', 'connect', 'qunit']);
	grunt.registerTask('default', ['test']);
};
