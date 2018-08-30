$(document).ready(function(){
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

	var tests = {
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

	test('Test if field contain attribute data-cache', function() {
		var object = $.parseJSON(field('simple-field').attr('data-cache'));
		equal(typeof object, 'object', 'Passed');
	});

	test('Test action define directy on input', function(assert) {
		sinon.spy($, "ajax");
		var field = tests['simple-field'];
		field['pointer'].val('a').trigger('blur');
		equal($.ajax.getCall(0).args[0].url, '/action/unique-field.html', 'Passed');
	});
});
