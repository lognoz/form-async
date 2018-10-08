module.exports = function( grunt ) {
	require( "load-grunt-tasks" )( grunt );

	grunt.config( "build", {
		"src/async.js": "dist/form-async.js"
	} );

	grunt.loadTasks( "build/tasks" );
	grunt.registerTask( "dev", [ "build", "dist" ] );
	grunt.registerTask( "default", [ "dev" ] );
};
