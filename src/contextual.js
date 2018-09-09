/**
 * Contextual manager is a singleton that be uses to manages application
 * references variables when developpers implements $.fn.autosave(). If
 * before, fail and success functions is sending as arguments, it will be
 * store in references variable.
 */
function ContextualManager() {
	this.references = {
		parent: [],
		selector: []
	},

	this.setSelector = function(properties) {
		properties.id_selector = this.references.selector.length;
		this.references.selector.push(properties);
		return properties;
	},

	this.setParent = function(properties) {
		var key;
		var exist = false;
		var list = this.references.parent;

		for (key in list) {
			if (list[key] === properties.parent[0]) {
				properties.id_parent = parseInt(key);
				exist = true;
			}
		}

		if (!exist) {
			this.references.parent.push(properties.parent[0]);
			properties.id_parent = length;
		}

		return properties;
	},

	this.watch = function(properties) {
		properties = this.setParent(properties);
		properties = this.setSelector(properties);
		return properties;
	},

	this.get = function(id, type) {
		return this.references[type][id];
	}
}
