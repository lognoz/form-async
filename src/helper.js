var helper = {
	tag: function(selector) {
		return selector.prop("tagName").toLowerCase();
	},
	type: function(selector) {
		return selector.attr('type') || null;
	},
	supported: function(target) {
		var selector = $(target);
		return [ 'input', 'checkbox', 'radio', 'textarea', 'select' ].indexOf(this.tag(selector)) != -1 ||
			selector.attr('contentEditable') && (selector.attr('name') || selector.attr('data-name'));
	},
	handler: function(selector) {
		return [ 'checkbox', 'radio' ].indexOf(this.type(selector)) !== -1 ||
			this.tag(selector) === 'select' ? 'change' : 'blur';
	},
	value: function(selector) {
		return [ 'checkbox', 'radio' ].indexOf(this.type(selector)) !== -1 ? selector.is(':checked') :
			selector.val() || selector.html();
	},
	properties: function(target) {
		var selector = $(target);
		return {
			tag:      this.tag(selector),
			type:     this.type(selector),
			handler:  this.handler(selector),
			value:    this.value(selector),
			action:   selector.attr('data-action') || null,
			timer:    selector.attr('data-timer') || null,
			name:     selector.attr('name') || selector.attr('data-name')
		};
	},
	child: function(target) {
		var children = target.children;
		var length = children.length;
		var list = [];
		var i = 0;

		if (length === 0) {
			if (this.supported(target))
				return [ this.properties(target) ];
		} else {
			for (; i < length; i++) {
				if (this.supported(children[i]))
					list.push(this.properties(children[i]));
			}

			return list
		}
	}
};
