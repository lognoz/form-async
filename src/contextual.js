/**
 * Contextual manager is a singleton that be uses to manages application
 * references variables when developpers implements $.fn.autosave(). If
 * before, fail and success functions is sending as arguments, it will be
 * store in references variable.
 */
var ContextualManager = (function() {
	var instance, references = {
		parent: [],
		selector: []
	};

	function ContextualManager() {
		return {
			watch: function(properties) {
				properties = this.set(properties, 'parent');
				properties = this.set(properties, 'selector');
				return properties;
			},
			set: function(properties, type) {
				var key;
				var exist = false;
				var list = references[type];
				var length = list.length;

				if (type === 'selector') {
					properties.id_selector = length;
					references[type].push(properties);
				} else {
					for (key in list) {
						if (list[key] === properties.parent[0]) {
							properties.id_parent = parseInt(key);
							exist = true;
						}
					}

					if (!exist) {
						references[type].push(properties.parent[0]);
						properties.id_parent = length;
					}
				}

				return properties;
			},
			get: function(id, type) {
				return references[type][id];
			}
		};
	}

	return {
		new: function(){
			if (instance == null) {
				instance = new ContextualManager();
			}
			return instance;
		}
	};
}());

var contextual = ContextualManager.new();
