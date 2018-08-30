module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				compress: {
					unsafe: true
				},
				screwIE8: false,
				banner: '/*! <%= pkg.name %> v<%= pkg.version %> | <%= pkg.license %> */\n'
			},
			build: {
				files: {
					'build/quick-autosave.min.js': 'src/quick-autosave.js',
					'build/quick-autosave-<%= pkg.version %>.min.js': 'src/quick-autosave.js'
				}
			}
		}
	});

	grunt.registerTask('test', ['uglify']);
	grunt.registerTask('default', ['test']);
};
