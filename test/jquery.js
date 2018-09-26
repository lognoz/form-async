( function() {
	var path = 'http://code.jquery.com/jquery-3.2.1.min.js',
		version = location.search.match( /[?&]jquery=(.*?)(?=&|$)/ );

	if ( version ) {
		path = 'http://code.jquery.com/jquery-' + version[ 1 ] + '.js';
	}

	document.write( '<script src="' + path + '"></script>' );
} )();
