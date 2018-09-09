module.exports = function (grunt) {
	require('load-grunt-tasks')(grunt);

	var gzip = require('gzip-js');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			all: [ 'src/**/*.js' ]
		},
		compare_size: {
			files: [ 'dist/js.autosave.min.js', 'dist/js.autosave.js' ],
			options: {
				compress: {
					gz: function (contents) {
						return gzip.zip(contents, {}).length;
					}
				},
				cache: 'build/.sizecache.json'
			}
		},
		template: {
			options: {
				data: function() {
					return {
						version: '1.0.0',
						years: grunt.template.today('yyyy')
					};
				}
			},
			lib: {
				src: 'src/wrapper.js',
				dest: 'build/js.autosave.js'
			}
		},
		includes: {
			options: {
				includeRegexp: /\/\/\s*include "(\S+)";/,
				includePath: 'src'
			},
			lib: {
				src: 'build/js.autosave.js',
				dest: 'dist/js.autosave.js'
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
					'dist/js.autosave.min.js': 'dist/js.autosave.js',
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

	grunt.registerTask('test', [ 'jshint', 'connect', 'qunit' ]);
	grunt.registerTask('build', [ 'template', 'includes', 'uglify', 'compare_size' ]);
	grunt.registerTask('default', [ 'build', 'test' ]);
};
