function Helper() {
	this.get = {
		tag: function(selector) {
			return selector.prop("tagName").toLowerCase();
		},
		type: function(selector) {
			return selector.attr('type') || null;
		},
		handler: function(selector) {
			return [ 'checkbox', 'radio' ].indexOf(this.type(selector)) !== -1 ||
				this.tag(selector) === 'select' ? 'change' : 'blur';
		},
		value: function(selector) {
			return [ 'checkbox', 'radio' ].indexOf(this.type(selector)) !== -1 ? selector.is(':checked') :
				selector.val() || selector.html();
		},
		action: function(selector, parent) {
			return parent.attr('data-action') || parent.attr('action') || selector.attr('data-action');
		},
		time: function(selector, parent) {
			return parent.attr('data-timer') || selector.attr('data-timer') || null;
		},
		name: function(selector) {
			return selector.attr('name') || selector.attr('data-name');
		},
		group: function (selector) {
			return selector.attr('data-autosave-group') || null;
		}
	},

	this.supported = function(target) {
		var selector = $(target);
		return [ 'input', 'checkbox', 'radio', 'textarea', 'select' ].indexOf(this.get.tag(selector)) != -1 ||
			selector.attr('contentEditable') && (selector.attr('name') || selector.attr('data-name'));
	},

	this.properties = function(parent, target, status) {
		var parent = $(parent);
		var selector = $(target);
		return {
			parent:    parent,
			selector:  selector,
			status:    status,
			tag:       this.get.tag(selector),
			type:      this.get.type(selector),
			handler:   this.get.handler(selector),
			value:     this.get.value(selector),
			action:    this.get.action(selector, parent),
			timer:     this.get.time(selector, parent),
			name:      this.get.name(selector),
			group:     this.get.group(selector)
		};
	},

	this.child = function(target, config) {
		var children = target.children;
		var length = children.length;
		var list = [];
		var i = 0;

		if (length === 0) {
			if (this.supported(target))
				return [ this.properties(target, target, config) ];
		} else {
			for (; i < length; i++) {
				if (this.supported(children[i]))
					list.push(this.properties(target, children[i], config));
			}

			return list
		}
	}
}
