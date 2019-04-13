module.exports = function() {
	return {
		options: {
			quiet: true
		},
		target: [
			"grunt/**/*.js",
			"src/**/*.js",
			"test/**/*.js",
			"Gruntfile.js",
			"!src/wrapper.js"
		]
	};
};
