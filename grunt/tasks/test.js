module.exports = function( grunt ) {
	function eslint() {
		return {
			options: {
				quiet: true
			},
			target: [
				"build/**/*.js",
				"src/**/*.js",
				"test/**/*.js",
				"Gruntfile.js",
				"!src/wrapper.js"
			]
		};
	}

	function connect() {
		return {
			server: {
				options: {
					port: 8000,
					base: "."
				}
			}
		};
	}

	function qunit() {
		return {
			all: {
				options: {
					urls: [
						"http://localhost:8000/test/index.html"
					]
				}
			}
		};
	}

	grunt.registerTask( "test", [], function() {
		grunt.config( "eslint", eslint() );
		grunt.config( "connect", connect() );
		grunt.config( "qunit", qunit() );
		grunt.task.run( [ "eslint", "connect", "qunit" ] );
	} );
};
