function save(event) {
	var selector = $(event.target);
	var id = selector.attr('data-autosave-id');
	var properties = contextual.get(id, 'selector');
	var value = helper.get.value(selector);

	if (properties.value !== value) {
		call(properties, value);
	}
}

function call(properties, value) {
	var values = {};
	var status = properties.status;

	if (properties.group !== null)
		values = helper.get.value_by_group(properties);
	else if (properties.type == 'checkbox' || properties.type == 'radio')
		values = helper.get.value_by_list(properties);
	else
		values[properties.name] = value;
}

var helper = new Helper();
var contextual = new ContextualManager();

$.fn.autosave = function(config) {
	config = config || {};

	$(this).each(function(event) {
		contextual.set('constructor', this);

		$.each(helper.child(this, config), function(index, properties) {
			var id = contextual.set('selector', properties);
			properties.selector.attr('data-autosave-id', id);
			properties.selector.on(properties.handler, save);
		});
	});
};
