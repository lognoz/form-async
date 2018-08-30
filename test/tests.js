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

	QUnit.test('Test if field contain attribute data-cache', function(assert) {
		var field = tests['simple-field'];
		var cache = field['pointer'].attr('data-cache');
		var json = $.parseJSON(cache);
		assert.equal(typeof json, 'object', 'Passed');
	});

	QUnit.asyncTest('Test blur on simple field', function(assert) {
		expect(1);
		var field = tests['simple-field'];
		var name = field['name'];
		field['pointer'].val('a').trigger('blur');
		window.setTimeout(function() {
			var json = field['output'].html();
			var data = $.parseJSON(json);
			assert.equal(data[name], 'a', 'Passed');
			QUnit.start();
		}, 1000);
	});
});
