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
	var children;
	var id_parent;

	$(this).each(function(event) {
		if (children = helper.child(this, config || {})) {
			id_parent = contextual.set_parent(this);

			$.each(children, function(index, properties) {
				properties = contextual.get_properties(properties, id_parent)
				properties.selector.attr('data-autosave-id', properties.id_selector);
				properties.selector.on(properties.handler, save);
			});
		}
	});
};
