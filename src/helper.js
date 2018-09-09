var helper = {
	tag: function(selector) {
		return selector.prop("tagName").toLowerCase();
	},
	supported: function(target) {
		var selector = $(target);
		return [ 'input', 'checkbox', 'radio', 'textarea', 'select' ].indexOf(this.tag(selector)) != -1 ||
			selector.attr('contentEditable') && (selector.attr('name') || selector.attr('data-name'));
	},
	child: function(target) {
		var children = target.children,
		    length = children.length,
		    list = [],
		    i = 0;

		if (length === 0) {
			if (this.supported(target))
				list.push(target);
		} else {
			for (; i < length; i++) {
				if (this.supported(children[i]))
					list.push(children[i]);
			}
		}

		return list;
	}
};
