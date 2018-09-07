(function(factory) {
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
      module.exports = factory(require('jquery'));
   } else {
      factory(jQuery);
	}
} (function($, window) {
	'use strict';

	var globals = {
		before:   [],
		fail:     [],
		success:  [],
		action:   [],
		form:     [],
		input:    []
	};

	function getGlobalVariable(type, value) {
		var key,
		    length = globals[type].length;

		for (key in globals[type]) {
			if (globals[type][key] == value) {
				return parseInt(key);
			}
		}

		globals[type].push(value);
		return length;
	}

	function watch(form, config) {
		var element, tag,
		    selector = $(form),
		    timer = selector.attr('data-timer'),
		    action = selector.attr('data-action') || selector.attr('action'),
		    elements = null,
		    i = 0;

		if (action == undefined)
			return;

		elements = getFormElements(form);

		for (; i < elements.length; i++) {
			element = $(elements[i]);
			tag = element.prop("tagName").toLowerCase();

			if (!supported(element, tag) || element.attr('data-autosave-id') !== undefined)
				continue;

			create(element, tag, {
				form: selector,
				before: config.before,
				success: config.success,
				fail: config.fail,
				action: element.attr('data-action') || action,
				timer: element.attr('data-timer') || timer
			});
		}
	}

	function getFormElements(form, config) {
		var list = [],
		    selector = $(form);

		if (selector.children().length == 0) {
			list.push(form);
		} else {
			selector.find('*').each(function() {
				list.push(this);
			});
		}

		return list;
	}

	function supported(selector, tag) {
		return [ 'input', 'checkbox', 'radio', 'textarea', 'select' ].indexOf(tag) != -1 ||
			selector.attr('contentEditable') && (selector.attr('name') || selector.attr('data-name'));
	}

	function getElementDetail(selector, tag) {
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
	}

	function create(selector, tag, config) {
		var name, length, element,
		    references = {};

		$.each(config, function(key, value) {
			if (value !== undefined && value !== null)
				references[key] = getGlobalVariable(key, value);
		});

		element = getElementDetail(selector, tag);
		length = globals.input.length;

		references.name = selector.attr('name') || selector.attr('data-name');
		references.selector = selector;
		references.tag = tag;
		references.trigger = element.trigger;
		references.value = element.value;

		globals.input.push(references);
		selector.attr('data-autosave-id', length);
		selector.on(element.trigger, save);
	}

	function save(event) {
		var selector = $(event.target),
		    id = selector.attr('data-autosave-id'),
		    references = globals.input[id],
			 element = getElementDetail(selector, references.tag);

		if (element.value !== references.value) {
			call(selector, references, element, id);
		}
	}

	function call(selector, references, detail, id) {
		var group = selector.attr('data-autosave-group'),
			 type = selector.attr('type'),
			 value = detail.value,
			 action = globals.action[references.action],
			 data = {},
			 parameters = {};

		if (group != undefined)
			data = getValueByGroup(references, group);
		else if (type == 'checkbox' || type == 'radio')
			data = getValueByList(references);
		else
			data[references.name] = detail.value;

		parameters = {
			action: action,
			data: data,
			selector: selector,
			retry: getRetryFunction(selector, references, detail, id)
		};

		if (references.before == undefined || globals.before[references.before](parameters) == true) {
			$.ajax({
				method: 'POST',
				url: action,
				data: data,
				success: function(data) {
					if (references.success != undefined)
						globals.success[references.success](data, parameters);

					globals.input[id].value = detail.value;
				},
				error: function() {
					if (references.fail != undefined)
						globals.fail[references.fail](parameters);
				}
			});
		}
	}

	function getRetryFunction(selector, references, detail, id) {
		return function(target, feedback) {
			var link;

			if (feedback == undefined)
				feedback = 'Your changes could not be saved. <a href="#">Try again</a>';

			target.html(feedback);
			link = target.find('a');

			link.attr('data-autosave-id', id);
			link.on('click', function(event) {
				event.preventDefault();
				call(selector, references, detail, id);
			});
		};
	}

	function getValueByGroup(references, group) {
		var list = group.replace(/\s/g,'').split(','),
			 input = globals.input,
			 data = {},
			 element,
			 i = 0;

		for (; i < input.length; i++) {
			if (input[i].form == references.form && list.indexOf(input[i.name])) {
				element = getElementDetail(input[i].selector, input[i].tag);
				data[input[i].name] = element.value;
			}
		}

		return data;
	}

	function getValueByList(references) {
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
	}

	$.fn.autosave = function(config) {
		config = config || {};

		$(this).each(function(event) {
			return watch(this, config);
		});
	};
}));
