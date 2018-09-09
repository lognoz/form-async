//function watch(form, config) {
//	var element, tag, index, value,
//		 selector = $(form),
//		 action = selector.attr('data-action') || selector.attr('action');
//
//	if (action !== undefined) {
//		$.each(helper.child(form), function(index, value) {
//			element = $(value);
//			tag = helper.tag(element);
//
//			create(element, tag, {
//				form:     selector,
//				before:   config.before,
//				success:  config.success,
//				fail:     config.fail,
//				action:   element.attr('data-action') || action,
//				timer:    element.attr('data-timer') || selector.attr('data-timer')
//			});
//		});
//	}
//}
//
//function create(properties) {
//	console.log(properties);
//
//	var name, id, element,
//		 references = {};
//
//	$.each(config, function(key, value) {
//		if (value !== undefined && value !== null)
//			references[key] = cm.append(key, value);
//	});
//
//	element = getElementDetail(selector, tag);
//
//	references.name = selector.attr('name') || selector.attr('data-name');
//	references.selector = selector;
//	references.tag = tag;
//	references.trigger = element.trigger;
//	references.value = element.value;
//
//	id = cm.append('input', references);
//	selector.attr('data-autosave-id', id);
//	selector.on(element.trigger, save);
//}
//
//function save(event) {
//	var selector = $(event.target),
//		 id = selector.attr('data-autosave-id'),
//		 references = cm.get('input', id),
//		 element = getElementDetail(selector, references.tag);
//
//	if (element.value !== references.value) {
//		call(selector, references, element, id);
//	}
//}
//
//function call(selector, references, detail, id) {
//	var group = selector.attr('data-autosave-group'),
//		 type = selector.attr('type'),
//		 value = detail.value,
//		 action = cm.get('action', references.action),
//		 data = {},
//		 parameters = {};
//
//	if (group != undefined)
//		data = getValueByGroup(references, group);
//	else if (type == 'checkbox' || type == 'radio')
//		data = getValueByList(references);
//	else
//		data[references.name] = detail.value;
//
//	parameters = {
//		action: action,
//		data: data,
//		selector: selector,
//		retry: getRetryFunction(selector, references, detail, id)
//	};
//
//	if (references.before == undefined || cm.get('before', references.before)(parameters) == true) {
//		$.ajax({
//			method: 'POST',
//			url: action,
//			data: data,
//			success: function(data) {
//				if (references.success != undefined)
//					cm.get('success', references.success)(data, parameters);
//
//				cm.update(id, detail.value);
//			},
//			error: function() {
//				if (references.fail != undefined)
//					cm.get('fail', references.fail)(parameters);
//			}
//		});
//	}
//}
//
//function getElementDetail(selector, tag) {
//	var type = selector.attr("type");
//	if (type == 'checkbox' || type == 'radio') {
//		return {
//			value: selector.is(':checked'),
//			trigger: 'change'
//		};
//	}
//	else if (tag == "input" || tag == "textarea") {
//		return {
//			value: selector.val(),
//			trigger: 'blur'
//		};
//	}
//	else if (tag == 'select') {
//		return {
//			value: selector.val(),
//			trigger: 'change'
//		};
//	}
//	else {
//		return {
//			value: selector.html(),
//			trigger: 'blur'
//		};
//	}
//}
//
//function getRetryFunction(selector, references, detail, id) {
//	return function(target, feedback) {
//		var link;
//
//		if (feedback == undefined)
//			feedback = 'Your changes could not be saved. <a href="#">Try again</a>';
//
//		target.html(feedback);
//		link = target.find('a');
//
//		link.attr('data-autosave-id', id);
//		link.on('click', function(event) {
//			event.preventDefault();
//			call(selector, references, detail, id);
//		});
//	};
//}
//
//function getValueByGroup(references, group) {
//	var list = group.replace(/\s/g,'').split(','),
//		 input = cm.all('input'),
//		 data = {},
//		 element,
//		 i = 0;
//
//	for (; i < input.length; i++) {
//		if (input[i].form == references.form && list.indexOf(input[i.name])) {
//			element = getElementDetail(input[i].selector, input[i].tag);
//			data[input[i].name] = element.value;
//		}
//	}
//
//	return data;
//}
//
//function getValueByList(references) {
//	var input = cm.all('input'),
//		 value = '',
//		 data = {},
//		 i = 0;
//
//	for (; i < input.length; i++) {
//		if (input[i].form == references.form && input[i].name == references.name) {
//			if (input[i].selector.is(':checked'))
//				value += input[i].selector.val() + '&';
//		}
//	}
//
//	if (value.length > 0)
//		value = value.substring(0, value.length - 1);
//
//	data[references.name] = value;
//	return data;
//}

function create(properties) {
	var references = contextual.watch(properties);
	selector.attr('data-autosave-id', references.id_selector);
	selector.on(element.handler, save);
}

$.fn.autosave = function(config) {
	config = config || {};

	$(this).each(function(event) {
		$.each(helper.child(this, config), function(index, properties) {
			if (properties.action !== null)
				create(properties)
		});
	});
};
