function create(properties) {
	var references = contextual.watch(properties);
	references.selector.attr('data-autosave-id', references.id_selector);
	references.selector.on(references.handler, save);
}

function save(event) {
	var selector = $(event.target);
	var id = selector.attr('data-autosave-id');
	var references = contextual.get(id, 'selector');
	var value = helper.get.value(selector);

	if (references.value !== value) {
		call(references, value);
	}
}

var helper = new Helper();
var contextual = new ContextualManager();

$.fn.autosave = function(config) {
	config = config || {};

	$(this).each(function(event) {
		$.each(helper.child(this, config), function(index, properties) {
			if (properties.action !== null)
				create(properties)
		});
	});
};
