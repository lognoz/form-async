(function(factory) {
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	}
	else if (typeof module === 'object' && module.exports) {
			module.exports = function(root, jQuery) {
			if (jQuery === undefined) {
				if (typeof window !== 'undefined') {
					jQuery = require('jquery');
				}
				else {
					jQuery = require('jquery')(root);
				}
			}
			factory(jQuery);
			return jQuery;
		};
	}
	else {
		factory(jQuery);
	}
})(function($, undefined) {
	'use strict';

	$.fn.autosave = function (config) {
		var target = $(this);
		var config = typeof(config) == undefined ? {} : config;

		for (var i = 0; i < target.length; i++)
			initialize($(target[i]), config);

		setInterval(function() {
			executeTimer();
		}, 1000);
	};

	var tracker = {
		action      : {},
		initializer : {},
		success     : {},
		interval    : {},
		fail        : {},
		before      : {},

		/* Describe the function here */
		generate : function (list) {
			var text = "";
			var char = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

			for (var i = 0; i < 3; i++)
				text += char.charAt(Math.floor(Math.random() * char.length));

			return list == null || list[text] == undefined ? text : tracker.generate(list);
		},

		/* Describe the function here */
		get : function (type, element) {
			var list = (type == "initializer" ? tracker[type].parent : tracker[type]);

			for (var i in tracker[type]) {
				if (tracker[type][i] == element)
					return i;
				else if (type == "initializer" && tracker[type][i].parent == element)
					return i;
			}

			var token = tracker.generate(list);
			if (type == "initializer") {
				tracker[type][token] = {
					parent : element,
					child  : []
				};
			}
			else {
				tracker[type][token] = element;
			}

			return token;
		}
	};

	function isSupport(target, tag) {
		if (tag == "input" || tag == "checkbox" || tag == "radio" || tag == "textarea" || tag == "select" ||
	      target.attr("contentEditable") == "true" && (target.attr("name") || target.attr("data-name")))
				return true;
	}

	function isExist(element) {
		return element != null && element != undefined;
	}

	function trackElement(target, tag, config) {
		var list = [ "initializer", "before", "success", "fail", "action" ];
		var track = {};

		for (var i = 0; i < list.length; i++) {
			var key = list[i];
			if(isExist(config[key]))
				track[key] = tracker.get(key, config[key]);
		}

		if (config.timer !== undefined)
			addToTimer(target, config, track.initializer);

		if (target.attr("data-cache") == undefined) {
			var token = track.initializer;
			tracker.initializer[token].child.push(target);

			setEvent(target, tag, track);
		}
	}

	function addToTimer(target, config, track) {
		if(tracker.interval[track] == undefined)
			tracker.interval[track] = {
				timestamp : getTime(),
				timer     : parseInt(config.timer),
				child     : []
			};

		tracker.interval[track].child.push(target);
	}

	function executeTimer() {
		for (var i in tracker.interval) {
			var config = tracker.interval[i];
			if (getTime() >= (config.timestamp + config.timer)) {
				for (var j in config.child) {
					save(
						config.child[j],
						JSON.parse(config.child[j].attr("data-cache"))
					);
				}

				tracker.interval[i].timestamp = getTime();
			}
		}
	}

	function getTime() {
		return Date.now() / 1000 | 0;
	}

	function setEvent(target, tag, config) {
		var parameter = getTargetInfo(target, tag);
		var name = target.attr("name") == undefined ? target.attr("data-name") : target.attr("name");
		var cache = "";

		config.name = name;
		config.value = parameter.value;
		cache = JSON.stringify(config);

		target.attr("data-cache", cache);
		target.on(parameter.event, function(event){
			var target = $(this);
			var cache = JSON.parse(target.attr("data-cache"));
			save(target, cache);
		});
	}

	function save(target, track, retry) {
		var tag  = target.prop("tagName").toLowerCase();
		var info = getTargetInfo(target, tag);

		if (info.value !== track.value || retry) {
			sendAjaxCall(target, track, info);
		}
	}

	function sendAjaxCall(target, track, info) {
		var name   = track.name;
		var parent = track.initializer;
		var group  = target.attr("data-group");
		var type   = target.attr("type");
		var value  = info.value;
		var action = tracker.action[track.action];
		var data   = {};

		var param  = {
			action  : action,
			data    : data,
			target  : target
		};

		if (group != undefined) {
			data = getValuesByGroup(name, parent, data, group);
		}
		else {
			if (type == 'checkbox' || type == 'radio')
				value = getValueByList(name, parent);

			data[name] = value;
		}

		if (track.before == undefined || tracker.before[track.before](param) == true) {
			param.before = track.value;
			param.retry  = getRetryFunction(target, track);
			track.value  = value;

			$.ajax({
				method : "POST",
				url : action,
				data : data,
				success : function(data) {
					var cache = JSON.stringify(track);

					if (track.success != undefined)
						tracker.success[track.success](data, param);

					if (type == 'checkbox' || type == 'radio')
						setCacheCheckboxRadio(name, parent);
					else
						target.attr('data-cache', cache);
				},
				error : function(){
					if (track.fail != undefined)
						tracker.fail[track.fail](param);
				}
			});
		}
	}

	function retry(link, target) {
		var track = JSON.parse(link.attr("data-cache"));
		save(target, track, true);
	}

	function getRetryFunction(target, track) {
		return function(element, feedback) {
			if (feedback == undefined)
				feedback = "Your changes could not be saved. <a href=\"#\">Try again</a>";

			element.html(feedback);
			var link = element.find("a");

			link.attr("data-cache", JSON.stringify(track));
			link.on("click", function(event){
				event.preventDefault();
				retry($(this), target)
			});
		};
	}

	function setCacheCheckboxRadio(name, parent) {
		var child = tracker.initializer[parent].child;

		if (child.length == 0)
			return;

		for (var i = 0; i < child.length; i++) {
			if (child[i].attr("data-name") == name || child[i].attr("name") == name) {
				var info = getTargetInfo(child[i], "radio");
				var data = JSON.parse(child[i].attr("data-cache"));

				data.value = info.value;
				data = JSON.stringify(data);
				child[i].attr('data-cache', data);
			}
		}
	}

	function getValuesByGroup(name, parent, parameter, group) {
		var list  = group.replace(/\s/g,'').split(',');
		var child = tracker.initializer[parent].child;

		for (var i = 0; i < child.length; i++) {
			for (var j = 0; j < list.length; j++) {
				if (child[i].attr("data-name") == list[j] || child[i].attr("name") == list[j]) {
					var name    = list[j];
					var element = child[i];
					var tag     = element.prop("tagName").toLowerCase();
					var type    = element.attr("type");
					var data    = getTargetInfo(element, tag);
					var value   = data.value;

					if (type == 'checkbox' || type == 'radio')
						value = getValueByList(name, parent);

					parameter[name] = value;
				}
			}
		}

		return parameter;
	}

	function getValueByList(name, parent) {
		var child = tracker.initializer[parent].child;
		var value = "";

		if (child.length == 0)
			return $("." + parent).val();

		for (var i = 0; i < child.length; i++) {
			if (child[i].attr("data-name") == name || child[i].attr("name") == name) {
				if (child[i].is(':checked'))
					value += child[i].val() + '&';
			}
		}

		if(value.length > 0)
			value = value.substring(0, value.length - 1);

		return value;
	}

	function getTargetInfo(target, tag) {
		var type = target.attr("type");
		var data = {};

		if (type == 'checkbox' || type == 'radio') {
			data.value = target.is(':checked');
			data.event = "change";
		}
		else if (tag == "input" || tag == "textarea") {
			data.value = target.val();
			data.event = "blur";
		}
		else if (tag == 'select') {
			data.value = target.val();
			data.event = "change";
		}
		else {
			data.value = target.html();
			data.event = "blur";
		}

		return data;
	}

	function setTarget(target, config) {
		var tag = target.prop("tagName").toLowerCase();
		if (isSupport(target, tag)) {
			var overwrite = {
				action : target.attr("data-action"),
				timer  : target.attr("data-timer")
			};

			var config = {
				initializer : config.initializer,
				before      : config.before,
				success     : config.success,
				fail        : config.fail,
				action      : overwrite.action == undefined ? config.action : overwrite.action,
				timer       : overwrite.timer == undefined ? config.timer : overwrite.timer
			};

			trackElement(target, tag, config);
		}
	}

	function initialize(initializer, config) {
		var tag    = initializer.prop("tagName").toLowerCase();
		var timer  = initializer.attr("data-timer");
		var action = null;

		if (!(action = initializer.attr(tag == "form" ? "action" : "data-action")) || action == null)
			return;

		config.action = action;
		config.timer = timer;
		config.initializer = initializer;

		if (initializer.children().length == 0) {
			setTarget(initializer, config);
		}
		else {
			initializer.find('*').each(function() {
				setTarget($(this), config);
			});
		}
	}
});