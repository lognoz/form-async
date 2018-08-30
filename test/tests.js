$(document).ready(function(){

	// Define environnement tests with DOM selector
	function define(target) {
		return {
			'pointer' : $(target),
			'name' : $(target).attr('name')
		};
	};

	// Get pointer key of a target name
	function field(target) {
		return tests[target].pointer;
	}

	// Change the value of an input and trigger an event
	function trigger(p) {
		return field(p.target)
			.val(p.value)
			.trigger(p.event);
	}

	// Define tests variables
	var tests = {
		'simple-field': define('#simple-field')
	};

	// Define success function for comparaison
	var success = function(data, parameter) {
		return 'success';
	};

	// Define fail function for comparaison
	var fail = function(data, parameter) {
		return 'fail';
	};

	// Active spy on ajax call
	sinon.spy($, "ajax");

	$('.exemple').autosave({
		success: function (data, parameter) {
			var target = parameter.target;
			var wrapper = target.parents('.test-case');
			var output = wrapper.children('.output');
			var json = JSON.stringify(parameter.data);
			return output.text(json);
		}
	});

	test('Test if field contain attribute data-cache', function() {
		var object = $.parseJSON(field('simple-field').attr('data-cache'));
		equal(typeof object, 'object', 'Passed');
	});

	test('Test action define directy on input', function(assert) {
		trigger({
			'target' : 'simple-field',
			'event'  : 'blur',
			'value'  : 'a'
		});

		equal($.ajax.getCall(0).args[0].url, '/action/unique-field.html', 'Passed');
	});
});
