$(document).ready(function(){
	function define(target) {
		return {
			'pointer' : $(target),
			'name'    : $(target).attr('name'),
			'output'  : $(target).parents('div').find('.output'),
		};
	};

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
		var field = tests['simple-field'];
		var cache = field['pointer'].attr('data-cache');
		var json = $.parseJSON(cache);
		equal(typeof json, 'object', 'Passed');
	});

	test('Test action define directy on input', function(assert) {
		sinon.replace($, 'ajax', sinon.fake());
		var field = tests['simple-field'];
		field['pointer'].val('a').trigger('blur');
		equal($.ajax.calledWithMatch({ url: '/action/unique-field.html' }), true, 'Passed');
	});
});
