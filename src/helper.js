var properties = {
	tag: function(selector) {
		return selector.tagName.toLowerCase();
	},
	action: function(selector) {
		return selector.getAttribute('action') || selector.getAttribute('data-action') || null;
	},
	name: function(selector) {
		return selector.getAttribute('name') || selector.getAttribute('data-name');
	},
	type: function(selector) {
		return selector.getAttribute('type') || null;
	},
	valid: function(selector) {
		return this.name(selector) && (
			[ 'input', 'checkbox', 'radio', 'textarea', 'select' ].indexOf( this.tag(selector) ) != -1 ||
			selector.getAttribute('contentEditable')
		);
	},
	handler: function(selector) {
		return [ 'checkbox', 'radio' ].indexOf( this.type(selector) ) !== -1
			|| this.tag(selector) === 'select' ? 'change' : 'blur';
	},
	state: function(selector) {
		return [ 'checkbox', 'radio' ].indexOf( this.type(selector) ) !== -1 ? selector.checked :
			selector.value || selector.innerHTML;
	},
	group: function(selector) {
		var data = selector.getAttribute('data-autosave-group');
		return data ? data.replace(/\s/g,'').split(',') : null;
	},
	value: function(elements) {
		var reference, name,
		    data = {};

		$.each(elements, function(index, pointer) {
			reference = contextual.get('element', pointer);
			name = reference.name;

			if (data[ name ] === undefined)
				data[ name ] = [];

			if ([ 'input', 'select', 'textarea' ].indexOf(reference.tag) !== -1) {
				if (reference.type !== 'checkbox' || reference.selector.checked) {
					data[ name ].push(reference.selector.value);
				}
			} else {
				data[ name ].push(reference.selector.innerHTML);
			}
		});

		for (var i in data)
			data[ i ] = data[ i ].join('&');

		return data;
	}
};
