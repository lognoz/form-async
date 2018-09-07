(function(factory) {
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
      module.exports = factory(require('jquery'));
   } else {
      factory(jQuery);
	}
} (function($) {
	'use strict';

	var globals = {
		setup: function() {
			this.before = [];
			this.fail = [];
			this.success = [];

			this.action = [];
			this.form = [];
			this.input = [];
		},
		get: function(type, value) {
			var key, length = this[type].length;
			for (key in this[type]) {
				if (this[type][key] == value) {
					return parseInt(key);
				}
			}

			this[type].push(value);
			return length;
		}
	};

	var autosave = {
		watch: function(target, config) {
			var selector = $(target),
			    tag = selector.prop('tagName').toLowerCase(),
			    timer = selector.attr('data-timer'),
			    action = selector.attr('data-action') || selector.attr('action');

			if (action == undefined)
				return;

			config.action = action;
			config.timer = timer;
			config.selector = selector;

			if (selector.children().length == 0) {
				autosave.add(selector, config);
			} else {
				selector.find('*').each(function() {
					autosave.add(this, config);
				});
			}
		},
		support: function(selector, tag) {
			return [ 'input', 'checkbox', 'radio', 'textarea', 'select' ].indexOf(tag) != -1 ||
				selector.attr('contentEditable') && (selector.attr('name') || selector.attr('data-name'));
		},
		add: function(target, config) {
			var selector = $(target),
			    tag = selector.prop("tagName").toLowerCase();

			if (!this.support(selector, tag))
				return;

			this.track(selector, tag, {
				form: config.selector,
				before: config.before,
				success: config.success,
				fail: config.fail,
				action: selector.attr('data-action') || config.action,
				timer: selector.attr('data-timer') || config.timer
			});
		},
		schema: function(selector, tag) {
			var type = selector.attr("type");
			if (type == 'checkbox' || type == 'radio') {
				return {
					value: selector.is(':checked'),
					trigger: 'change'
				};
			}
			else if (tag == "input" || tag == "textarea") {
				return {
					value: selector.val(),
					trigger: 'blur'
				};
			}
			else if (tag == 'select') {
				return {
					value: selector.val(),
					trigger: 'change'
				};
			}
			else {
				return {
					value: selector.html(),
					trigger: 'blur'
				};
			}
		},
		track: function(selector, tag, config) {
			var name, length, schema, references = {};

			$.each(config, function(key, value) {
				if (value !== undefined && value !== null)
					references[key] = globals.get(key, value);
			});

			if (selector.attr('data-autosave-id') == undefined) {
				schema = this.schema(selector, tag);
				length = globals.input.length;

				references.name = selector.attr('name') || selector.attr('data-name');
				references.selector = selector;
				references.tag = tag;
				references.trigger = schema.trigger;
				references.value = schema.value;

				globals.input.push(references);
				selector.attr('data-autosave-id', length);
				selector.on(schema.trigger, function(event) {
					var selector = $(this),
					    id = selector.attr('data-autosave-id');

					autosave.save(selector, id);
				});
			}
		},
		save: function(selector, id, retry) {
			var references = globals.input[id],
			    schema = this.schema(selector, references.tag);

			if (schema.value !== references.value) {
				this.call(selector, references, schema, id);
			}
		},
		call: function(selector, references, schema, id) {
			var group = selector.attr('data-autosave-group'),
			    type = selector.attr('type'),
			    value = schema.value,
			    action = globals.action[references.action],
			    data = {},
			    parameters = {};

			if (group != undefined)
				data = this.group(references, data, group);
			else if (type == 'checkbox' || type == 'radio')
				data = this.list(references);
			else
				data[references.name] = schema.value;

			parameters = {
				action: action,
				data: data,
				selector: selector,
				retry: function(dom, feedback) {
					var link;

					if (feedback == undefined)
						feedback = 'Your changes could not be saved. <a href="#">Try again</a>';

					dom.html(feedback);
					link = selector.find('a');

					link.attr('data-autosave-id', id);
					link.on('click', function(event) {
						event.preventDefault();
						autosave.call(selector, references, schema, id);
					});
				}
			};

			if (references.before == undefined || globals.before[references.before](parameters) == true) {
				$.ajax({
					method: 'POST',
					url: action,
					data: data,
					success: function(data) {
						if (references.success != undefined)
							globals.success[references.success](data, parameters);

						globals.input[id].value = schema.value;
					},
					error: function() {
						if (references.fail != undefined)
							globals.fail[references.fail](parameters);
					}
				});
			}
		},
		list: function(references) {
			var input = globals.input,
			    value = '',
			    data = {},
			    i = 0;

			for (; i < input.length; i++) {
				if (input[i].form == references.form && input[i].name == references.name) {
					if (input[i].selector.is(':checked'))
						value += input[i].selector.val() + '&';
				}
			}

			if (value.length > 0)
				value = value.substring(0, value.length - 1);

			data[references.name] = value;
			return data;
		},
		group: function(references, data, group) {
			var list = group.replace(/\s/g,'').split(','),
			    input = globals.input,
			    data = {},
			    schema,
			    i = 0;

			for (; i < input.length; i++) {
				if (input[i].form == references.form && list.indexOf(input[i.name])) {
					schema = this.schema(input[i].selector, input[i].tag);
					data[input[i].name] = schema.value;
				}
			}

			return data;
		}
	};

	globals.setup();

	$.fn.autosave = function(config) {
		config = config || {};

		$(this).each(function(event) {
			return autosave.watch(this, config);
		});
	};
}));
