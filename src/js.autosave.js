(function(factory) {
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
      module.exports = factory(require('jquery'));
   } else {
      factory(jQuery);
	}
} (function($) {
	'use strict';

	var reference = {
		setup: function() {
			this.before = [];
			this.fail = [];
			this.success = [];

			this.action = [];
			this.form = [];
			this.input = [];
		},
		get: function(type, value) {
			var key, length = this[type].length;
			for (key in this[type]) {
				if (this[type][key] == value) {
					return parseInt(key);
				}
			}

			this[type].push(value);
			return length;
		}
	};

	var autosave = {
		watch: function(target, config) {
			var selector = $(target),
			    tag = selector.prop('tagName').toLowerCase(),
			    timer = selector.attr('data-timer'),
			    action = selector.attr('data-action') || selector.attr('action');

			if (action == undefined)
				return;

			config.action = action;
			config.timer = timer;
			config.selector = selector;

			if (selector.children().length == 0) {
				autosave.add(selector, config);
			} else {
				selector.find('*').each(function() {
					autosave.add(this, config);
				});
			}
		},
		support: function(selector, tag) {
			return [ 'input', 'checkbox', 'radio', 'textarea', 'select' ].indexOf(tag) != -1 ||
				selector.attr('contentEditable') && (selector.attr('name') || selector.attr('data-name'));
		},
		add: function(target, config) {
			var selector = $(target),
			    tag = selector.prop("tagName").toLowerCase();

			if (!this.support(selector, tag))
				return;

			this.track(selector, tag, {
				form: config.selector,
				before: config.before,
				succes: config.success,
				fail: config.fail,
				action: selector.attr('data-action') || config.action,
				timer: selector.attr('data-timer') || config.timer
			});
		},
		track: function(selector, tag, config) {
			var references = {};

			$.each(config, function(key, value) {
				if (value !== undefined && value !== null)
					references[key] = reference.get(key, value);
			});
		}
	};

	reference.setup();

	$.fn.autosave = function(config) {
		config = config || {};

		$(this).each(function(event) {
			return autosave.watch(this, config);
		});
	};

//	$.fn.autosave = function(config) {
//		var target = $(this),
//		    length = target.length,
//		    i = 0;
//
//		for (; i < length; i++)
//			initialize($(target[i]), config || {});
//
//		setInterval(function() {
//			executeTimer();
//		}, 1000);
//	};

//	var tracker = {
//		action      : {},
//		initializer : {},
//		success     : {},
//		interval    : {},
//		fail        : {},
//		before      : {},
//
//		/* Describe the function here */
//		generate : function (list) {
//			var text = "";
//			var char = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//
//			for (var i = 0; i < 3; i++)
//				text += char.charAt(Math.floor(Math.random() * char.length));
//
//			return list == null || list[text] == undefined ? text : tracker.generate(list);
//		},
//
//		/* Describe the function here */
//		get : function (type, element) {
//			var list = (type == "initializer" ? tracker[type].parent : tracker[type]);
//
//			for (var i in tracker[type]) {
//				if (tracker[type][i] == element)
//					return i;
//				else if (type == "initializer" && tracker[type][i].parent == element)
//					return i;
//			}
//
//			var token = tracker.generate(list);
//			if (type == "initializer") {
//				tracker[type][token] = {
//					parent : element,
//					child  : []
//				};
//			}
//			else {
//				tracker[type][token] = element;
//			}
//
//			return token;
//		}
//	};
//
//	function isSupport( target, tag ) {
//		return [ 'input', 'checkbox', 'radio', 'textarea', 'select' ].indexOf(tag) != -1 ||
//			target.attr( 'contentEditable' ) && ( target.attr( 'name' ) || target.attr( 'data-name' ) );
//	}
//
//	function isExist( element ) {
//		return element != null && element != undefined;
//	}
//
//	function trackElement(target, tag, config) {
//		var token, key,
//		    list = [ 'initializer', 'before', 'success', 'fail', 'action' ],
//		    track = {},
//		    length = list.length,
//		    i = 0;
//
//		for ( ; i < length; i++ ) {
//			key = list[ i ];
//			if ( isExist( config[ key ] ) )
//				track[ key ] = tracker.get( key, config[ key ] );
//		}
//
//		if ( config.timer !== undefined )
//			addToTimer( target, config, track.initializer );
//
//		if ( target.attr( 'data-cache' ) == undefined ) {
//			token = track.initializer;
//			tracker.initializer[ token ].child.push( target );
//
//			setEvent( target, tag, track );
//		}
//	}
//
//	function addToTimer( target, config, track ) {
//		if( tracker.interval[ track ] == undefined )
//			tracker.interval[ track ] = {
//				timestamp : getTime(),
//				timer     : parseInt( config.timer ),
//				child     : []
//			};
//
//		tracker.interval[ track ].child.push( target );
//	}
//
//	function executeTimer() {
//		var i, j, config;
//
//		for ( i in tracker.interval ) {
//			config = tracker.interval[ i ];
//			if ( getTime() >= ( config.timestamp + config.timer ) ) {
//				for ( j in config.child ) {
//					save(
//						config.child[ j ],
//						JSON.parse( config.child[ j ].attr( 'data-cache' ) )
//					);
//				}
//
//				tracker.interval[ i ].timestamp = getTime();
//			}
//		}
//	}
//
//	function getTime() {
//		return Date.now() / 1000 | 0;
//	}
//
//	function setEvent( target, tag, config ) {
//		var parameter = getTargetInfo( target, tag ),
//		    name = target.attr( 'name' ) || target.attr( 'data-name' ),
//		    cache = '';
//
//		config.name = name;
//		config.value = parameter.value;
//		cache = JSON.stringify( config );
//
//		target.attr( 'data-cache', cache );
//		target.on( parameter.event, function( event ) {
//			target = $( this );
//			cache = JSON.parse( target.attr( 'data-cache' ) );
//			save( target, cache );
//		});
//	}
//
//	function save( target, track, retry ) {
//		var tag = target.prop( 'tagName' ).toLowerCase(),
//		    info = getTargetInfo( target, tag );
//
//		if ( info.value !== track.value || retry ) {
//			sendAjaxCall( target, track, info );
//		}
//	}
//
//	function sendAjaxCall( target, track, info ) {
//		var name = track.name,
//		    parent = track.initializer,
//		    group  = target.attr( 'data-group' ),
//		    type   = target.attr( 'type' ),
//		    value  = info.value,
//		    action = tracker.action[ track.action ],
//		    data   = {};
//
//		var param  = {
//			'action' : action,
//			'data' : data,
//			'target' : target
//		};
//
//		if ( group != undefined ) {
//			data = getValuesByGroup( name, parent, data, group );
//		} else {
//			if ( type == 'checkbox' || type == 'radio' )
//				value = getValueByList( name, parent );
//
//			data[name] = value;
//		}
//
//		if ( track.before == undefined || tracker.before[ track.before ]( param ) == true ) {
//			param.before = track.value;
//			param.retry  = getRetryFunction( target, track );
//			track.value  = value;
//
//			$.ajax( {
//				method : 'POST',
//				url : action,
//				data : data,
//				success : function( data ) {
//					if ( track.success != undefined )
//						tracker.success[ track.success ]( data, param );
//
//					if ( type == 'checkbox' || type == 'radio' )
//						setCacheCheckboxRadio( name, parent );
//					else
//						target.attr( 'data-cache', JSON.stringify( track ) );
//				},
//				error : function(){
//					if ( track.fail != undefined )
//						tracker.fail[ track.fail ]( param );
//				}
//			} );
//		}
//	}
//
//	function retry( link, target ) {
//		var track = JSON.parse( link.attr("data-cache") );
//		save( target, track, true );
//	}
//
//	function getRetryFunction( target, track ) {
//		return function( element, feedback ) {
//			var link;
//
//			if ( feedback == undefined )
//				feedback = 'Your changes could not be saved. <a href="#">Try again</a>';
//
//			element.html( feedback );
//			link = element.find( 'a' );
//
//			link.attr( 'data-cache', JSON.stringify( track ) );
//			link.on( 'click', function( event ) {
//				event.preventDefault();
//				retry( $( this ), target );
//			});
//		};
//	}
//
//	function setCacheCheckboxRadio( name, parent ) {
//		var info, data,
//		    child = tracker.initializer[ parent ].child,
//		    length = child.length,
//		    i = 0;
//
//		if ( child.length == 0 )
//			return;
//
//		for ( ; i < length; i++ ) {
//			if ( child[ i ].attr( 'data-name' ) == name || child[ i ].attr( 'name' ) == name ) {
//				info = getTargetInfo( child[ i ], 'radio' );
//				data = JSON.parse( child[ i ].attr( 'data-cache' ) );
//
//				data.value = info.value;
//				data = JSON.stringify( data );
//				child[ i ].attr( 'data-cache', data );
//			}
//		}
//	}
//
//	function getValuesByGroup(name, parent, parameter, group) {
//		var list  = group.replace(/\s/g,'').split(',');
//		var child = tracker.initializer[parent].child;
//
//		for (var i = 0; i < child.length; i++) {
//			for (var j = 0; j < list.length; j++) {
//				if (child[i].attr("data-name") == list[j] || child[i].attr("name") == list[j]) {
//					name    = list[j];
//					var element = child[i];
//					var tag     = element.prop("tagName").toLowerCase();
//					var type    = element.attr("type");
//					var data    = getTargetInfo(element, tag);
//					var value   = data.value;
//
//					if (type == 'checkbox' || type == 'radio')
//						value = getValueByList(name, parent);
//
//					parameter[name] = value;
//				}
//			}
//		}
//
//		return parameter;
//	}
//
//	function getValueByList( name, parent ) {
//		var child = tracker.initializer[ parent ].child,
//		    value = '',
//		    i = 0;
//
//		if ( child.length == 0 )
//			return $( "." + parent ).val();
//
//		for ( ; i < child.length; i++ ) {
//			if ( child[ i ].attr( 'data-name' ) == name || child[ i ].attr( 'name' ) == name ) {
//				if ( child[ i ].is( ':checked' ))
//					value += child[ i ].val() + '&';
//			}
//		}
//
//		if ( value.length > 0 )
//			value = value.substring( 0, value.length - 1 );
//
//		return value;
//	}
//
//	function getTargetInfo(target, tag) {
//		var type = target.attr("type");
//		var data = {};
//
//		if (type == 'checkbox' || type == 'radio') {
//			data.value = target.is(':checked');
//			data.event = "change";
//		}
//		else if (tag == "input" || tag == "textarea") {
//			data.value = target.val();
//			data.event = "blur";
//		}
//		else if (tag == 'select') {
//			data.value = target.val();
//			data.event = "change";
//		}
//		else {
//			data.value = target.html();
//			data.event = "blur";
//		}
//
//		return data;
//	}
//
//	function setTarget(target, config) {
//		var tag = target.prop("tagName").toLowerCase();
//		if (isSupport(target, tag)) {
//			var overwrite = {
//				action : target.attr("data-action"),
//				timer  : target.attr("data-timer")
//			};
//
//			trackElement(target, tag, {
//				initializer : config.initializer,
//				before      : config.before,
//				success     : config.success,
//				fail        : config.fail,
//				action      : overwrite.action == undefined ? config.action : overwrite.action,
//				timer       : overwrite.timer == undefined ? config.timer : overwrite.timer
//			} );
//		}
//	}
//
//	function initialize(initializer, config) {
//		var tag    = initializer.prop("tagName").toLowerCase();
//		var timer  = initializer.attr("data-timer");
//		var action = null;
//
//		if (!(action = initializer.attr(tag == "form" ? "action" : "data-action")) || action == null)
//			return;
//
//		config.action = action;
//		config.timer = timer;
//		config.initializer = initializer;
//
//		if (initializer.children().length == 0) {
//			setTarget(initializer, config);
//		}
//		else {
//			initializer.find('*').each(function() {
//				setTarget($(this), config);
//			});
//		}
//	}
}));
