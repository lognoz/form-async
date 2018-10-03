var regex = {
	defineEnding:    /\}\s*?\);[^}\w]*$/,
	defineWrapper:   /define\([^{]*?{\s*(?:("|')use strict\1(?:;|))?/,
	functionReturn:  /\s*return\s+[^\}]+(\}\s*?\);[^\w\}]*)$/,
	variableDefine:  /define\([\w\W]*?return/,
	variableName:    /var\/([\w-]+)/
};

function convertToStatement( content ) {
	return format(
		content
		.replace( regex.functionReturn, '$1' )
		.replace( regex.defineWrapper, '' )
		.replace( regex.defineEnding, '' )
	);
}

function convertToVariable( name, content ) {
	return format(
		content
		.replace( regex.variableDefine, 'var ' + getVariableName( name ) + ' =' )
		.replace( regex.defineEnding, '' )
	);
}

function getVariableName( name ) {
	return regex.variableName.exec( name )[ 1 ];
}

function format( content ) {
	content = content.trim();
	return content !== '' ? "\n\t" + content : content;
}

function build( name, path, content ) {
	switch( true ) {
		case name.indexOf( 'src/var/' ) == 0:
			return convertToVariable( name, content );
			break;

		case name.indexOf( 'src/core.js' ) !== 0:
			return convertToStatement( content );
			break;

		default:
			return '';
	};
}

module.exports.tasks = {
	requirejs: {
		js: {
			options: {
				baseUrl: '.',
				out: 'dist/form-async.js',
				exclude: [ 'jquery' ],
				include: [ 'src/core.js' ],
				paths: {
					jquery: 'node_modules/jquery/dist/jquery',
				},

				//Additional processing
				onBuildWrite: build,

				// Allow strict mode
				useStrict: true,

				// Avoid breaking semicolons
				skipSemiColonInsertion: true,

				// No minification
				optimize: 'none'
			}
		}
	}
};
