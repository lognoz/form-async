$(document).ready(function(){
	window.tests = {};

	function init() {
		sinon.spy($, "ajax");
		tests = {
			'simple-field': define('#simple-field')
		};

		$('.exemple').autosave({
			success: function (data, parameter) {
				var target = parameter.target;
				var wrapper = target.parents('.test-case');
				var output = wrapper.children('.output');
				var json = JSON.stringify(parameter.data);
				return output.text(json);
			}
		});
	}

	function define(target) {
		return {
			'pointer' : $(target),
			'name'    : $(target).attr('name'),
			'output'  : $(target).parents('div').find('.output'),
		};
	};

	function field(target) {
		return tests[target].pointer;
	}

	function trigger(p) {
		return field(p.target).val(p.value).trigger(p.event);
	}

	init();

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
