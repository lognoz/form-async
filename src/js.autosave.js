/*!
 * JavaScript Autosave v<%= version %>
 * https://github.com/lognoz/js-autosave
 *
 * Copyright 2018, <%= years %> Marc-Antoine Loignon
 * Released under the MIT license
 */
(function(factory) {
	if (typeof define === 'function' && define.amd)
		define([ 'jquery' ], factory);
	else if (typeof exports === 'object')
		module.exports = factory(require('jquery'));
	else
		factory(jQuery);
}(function($, window){
	'use strict';

	var ContextualManager = function() {
		var references = {
			constructor: [],
			element: [],
			watcher: []
		};

		this.set = function(type, parameters) {
			return references[type].push(parameters) - 1;
		};
		this.get = function(type, key) {
			return references[type][key];
		};
		this.update = function(options) {
			return (references[options.reference][options.key][options.parameter] = options.value);
		};
	};

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
			return [ 'checkbox', 'radio' ].indexOf( this.type(selector) ) !== -1 ||
				this.tag(selector) === 'select' ? 'change' : 'blur';
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
			var i, reference, name,
		    	 data = {};

			$.each(elements, function(index, pointer) {
				reference = contextual.get('element', pointer);
				name = reference.name;

				if (data[name] === undefined)
					data[name] = [];

				if ([ 'input', 'select', 'textarea' ].indexOf(reference.tag) !== -1) {
					if (reference.type !== 'checkbox' || reference.selector.checked) {
						data[name].push(reference.selector.value);
					}
				} else {
					data[name].push(reference.selector.innerHTML);
				}
			});

			for (i in data)
				data[i] = data[i].join('&');

			return data;
		}
	};

	var autosave = {
		construct: function(options) {
			return contextual.set('constructor', options || {});
		},

		watch: function(element, constructor) {
			return contextual.set('watcher', {
				action      : properties.action(element),
				constructor : constructor,
				selector    : element,
				children    : []
			});
		},

		save: function(event) {
			var selector = event.target,
		    	 state = properties.state(selector),
		    	 id = selector.getAttribute('data-autosave-id'),
		    	 element = contextual.get('element', id);

			if (element.state !== state) {
				autosave.call(element, state, id);
			}
		},

		retry: function(element, state, id) {
			return function(target, feedback) {
				var link,
			    	 selector = $(target);

				if (feedback == undefined)
					feedback = 'Your changes could not be saved. <a href="#">Try again</a>';

				selector.html(feedback);

				link = selector.find('a');
				link.attr('data-autosave-id', id);
				link.on('click', function(event) {
					event.preventDefault();
					autosave.call(element, state, id);
				});
			};
		},

		call: function(element, state, id) {
			var data = element.data(),
		    	 options = element.options,
		    	 watcher = contextual.get('watcher', element.watcher),
		    	 action = element.action || watcher.action;

			options.selector = element.selector;
			options.retry = autosave.retry(element, state, id);
			options.action = action;
			options.data = data;
			options.properties = {
				name: element.name,
				tag: element.tag,
				type: element.type,
				handler: element.handler
			};

			if (options.before == undefined || options.before()) {
				$.ajax({
					method: 'POST',
					url: action,
					data: data,
					success: function(data) {
						contextual.update({
							reference: 'element',
							parameter: 'state',
							key: id,
							value: state
						});

						if (options.success !== undefined)
							options.success(data);
					},
					error: function() {
						if (options.fail !== undefined)
							options.fail();
					}
				});
			}
		},

		create: function(target, watcher) {
			return contextual.set('element', new Element(target, watcher));
		},

		find: function(elements, list) {
			var references,
		    	 data = [];

			$(elements).each(function(index, pointer) {
				references = contextual.get('element', pointer);
				if (list.indexOf(references.name) !== -1)
					data.push(pointer);
			});

			return data;
		},

		dependency: function(elements, reference, key) {
			if (reference.type === 'checkbox')
				return autosave.find(elements, [ reference.name ]);
			else if (reference.attribute.group)
				return autosave.find(elements, reference.attribute.group);
			else
				return [ key ];
		},

		track: function(elements, watcher) {
			var reference;

			contextual.update({
				reference: 'watcher',
				parameter: 'children',
				key: watcher,
				value: elements
			});

			$(elements).each(function(index, pointer) {
				reference = contextual.get('element', pointer);

				contextual.update({
					reference: 'element',
					parameter: 'dependency',
					key: pointer,
					value: autosave.dependency(elements, reference, pointer)
				});

				$(reference.selector).attr('data-autosave-id', pointer);
				$(reference.selector).on(reference.handler, autosave.save);
			});
		}
	};

	function Element(target, watcher) {
		this.selector    = target;
		this.watcher     = watcher;
		this.action      = properties.action(target);
		this.handler     = properties.handler(target);
		this.name        = properties.name(target);
		this.tag         = properties.tag(target);
		this.type        = properties.type(target);
		this.state       = properties.state(target);
		this.dependency  = [];

		this.attribute   = {
			group: properties.group(target)
		};

		this.options = contextual.get('constructor',
			contextual.get('watcher', this.watcher).constructor
		);

		this.data = function() {
			return properties.value(this.dependency);
		};
	}

	var contextual = new ContextualManager();

	$.fn.autosave = function(options) {
		var watcher, elements,
	    	 constructor = autosave.construct(options || {});

		$(this).each(function(event) {
			elements = [];
			watcher = autosave.watch(this, constructor);

			if (this.children.length == 0) {
				elements.push(autosave.create(this, watcher));
			} else {
				$(this.children).each(function(event) {
					elements.push(autosave.create(this, watcher));
				});
			}

			return autosave.track(elements, watcher);
		});
	};
}));
