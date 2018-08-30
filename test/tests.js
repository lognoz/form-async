function define(target) {
	return {
		'pointer' : $(target),
		'name' : $(target).attr('name')
	};
};

function field(target) {
	return tests[target].pointer;
}

function trigger(p) {
	return field(p.target)
		.val(p.value)
		.trigger(p.event);
}

$(document).ready(function(){
	sinon.spy($, "ajax");

	var tests = {
		'simple-field': define('#simple-field')
	};

	var parameters = {
		success: function(data, parameter) {
			return 'success';
		},
		fail: function(parameter) {
			return 'fail';
		}
	};

	$('.exemple').autosave(parameters);

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
