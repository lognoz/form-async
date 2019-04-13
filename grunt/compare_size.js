module.exports = function() {
	return {
		files: [ "dist/form-async.min.js", "dist/form-async.js" ],
		options: {
			compress: {
				gz: function( contents ) {
					return require( "gzip-js" ).zip( contents, {} ).length;
				}
			}
		}
	};
};
