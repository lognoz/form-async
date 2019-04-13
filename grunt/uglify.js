module.exports = function( grunt ) {
	var package = grunt.file.readJSON( "package.json" );

	return {
		all: {
			files: {
				"dist/form-async.min.js": "dist/form-async.js"
			},
			options: {
				banner: "/*! Form Async - v" + package.version + " | " +
					"(c) Form Async and other contributors */",
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
};
