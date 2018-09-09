var ContextualManager = (function() {
	var instance, references = {
		before:    [],
		fail:      [],
		success:   [],
		action:    [],
		form:      [],
		input:     []
	};

	function ContextualManager() {
		return {
			all: function(type) {
				return references[type];
			},
			append: function(type, value) {
				var key,
					 list = references[type],
					 id = list.length;

				for (key in list) {
					if (references[type][key] == value)
						return parseInt(key);
				}

				references[type].push(value);
				return id;
			},
			get: function(type, id) {
				return references[type][id];
			},
			update: function(id, value) {
				references.input[id].value = value;
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

var cm = ContextualManager.new();
