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
	};

	this.watch = function(properties) {
		properties = this.set(properties, 'parent');
		properties = this.set(properties, 'selector');
		return properties;
	},

	this.set = function(properties, type) {
		var key;
		var exist = false;
		var list = this.references[type];
		var length = list.length;

		if (type === 'selector') {
			properties.id_selector = length;
			this.references[type].push(properties);
		} else {
			for (key in list) {
				if (list[key] === properties.parent[0]) {
					properties.id_parent = parseInt(key);
					exist = true;
				}
			}

			if (!exist) {
				this.references[type].push(properties.parent[0]);
				properties.id_parent = length;
			}
		}

		return properties;
	},

	this.get = function(id, type) {
		return this.references[type][id];
	}
}
