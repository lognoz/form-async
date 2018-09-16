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
				src: 'src/js.autosave.js',
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
			'server': {
				options: {
					port: 8000,
					base: '.'
				}
			},
			'build-sauce': {
				options: {
					port: 9999,
					base: ['.', 'test']
				}
			}
		},
		'saucelabs-qunit': {
			all: {
				options: {
					urls: ['http://127.0.0.1:9999'],
					testname: 'Sauce Test for js-cookie',
					build: process.env.TRAVIS_JOB_ID,
					statusCheckAttempts: -1,
					throttled: 3,
					browsers: [
						{
							browserName: 'safari',
							platform: 'OS X 10.11',
							version: '10.0'
						},
						{
							browserName: 'safari',
							platform: 'OS X 10.12',
							version: '10.1'
						},
						{
							browserName: 'safari',
							platform: 'OS X 10.13',
							version: '11.0'
						},
						{
							browserName: 'firefox',
							platform: 'OS X 10.11',
							version: '56.0'
						},
						{
							browserName: 'chrome',
							platform: 'OS X 10.10',
							version: '61.0'
						},
						{
							browserName: 'internet explorer',
							platform: 'Windows 7',
							version: '11.0'
						},
						{
							browserName: 'internet explorer',
							platform: 'Windows 7',
							version: '10.0'
						},
						{
							browserName: 'internet explorer',
							platform: 'Windows 7',
							version: '9.0'
						},
						{
							browserName: 'internet explorer',
							platform: 'Windows 7',
							version: '8.0'
						},
						{
							browserName: 'firefox',
							platform: 'Linux',
							version: '45.0'
						},
						{
							browserName: 'chrome',
							platform: 'Linux',
							version: '48.0'
						}
					]
				}
			}
		}
	});

	grunt.registerTask('test', [ 'jshint', 'connect', 'qunit' ]);
	grunt.registerTask('build', [ 'template', 'uglify', 'compare_size' ]);
	grunt.registerTask('all', [ 'build', 'test' ]);
};
