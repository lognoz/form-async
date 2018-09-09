/**
 * Contextual manager is a singleton that be uses to manages application
 * references variables when developpers implements $.fn.autosave(). If
 * before, fail and success functions is sending as arguments, it will be
 * store in references variable.
 *
 *  references.before:   function
 *  references.fail:     function
 *  references.success:  function
 *  references.action:   selectors action attribute
 *  references.form:     intializator selectors
 *  references.input:
 *    {
 *      action    key of references.action
 *      form      key of references.form
 *      name      selector name attribute
 *      selector  selector itself
 *      tag       selector tag type
 *      trigger   type of trigger event
 *      value     last saving value
 *    }
 */
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
