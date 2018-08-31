$(document).ready(function(){
	module('Test case', {
		setup: function() {
			$('.exemple').autosave({
				success: function(data, parameters) {
					return 'Success';
				},
				fail: function(parameters) {
					return 'Fail';
				}
			});
		}
	});

	test('self initialisation with data-action', function(assert) {
		var save = sinon.spy($, "ajax");

		$('#simple-field')
			.val('apple')
			.trigger('blur');

		assert.ok($('#simple-field').attr('data-cache'));
		assert.ok($.ajax.calledWithMatch({ url: '/action/unique-field.html' }));
		assert.ok($.ajax.calledWithMatch({ data: {'xs_username': 'apple'} }));

		save.restore();
	});

	test('form initialisation with action', function(assert) {
		var save = sinon.spy($, "ajax");

		$('#multiple-fields-name')
			.val('apple')
			.trigger('blur');

		assert.ok($('#multiple-fields-name').attr('data-cache'));
		assert.ok($.ajax.calledWithMatch({ url: '/action/multiple-fields.html' }));
		assert.ok($.ajax.calledWithMatch({ data: {'xs_name': 'apple'} }));

		$('#multiple-fields-phone')
			.val('orange')
			.trigger('blur');

		assert.ok($('#multiple-fields-phone').attr('data-cache'));
		assert.ok($.ajax.calledWithMatch({ url: '/action/multiple-fields.html' }));
		assert.ok($.ajax.calledWithMatch({ data: {'xs_phone': 'orange'} }));

		save.restore();
	});

//	var requirement = {
//		'#simple-field': '/action/unique-field.html',
//		'#multiple-fields-name': '/action/multiple-fields.html',
//		'#multiple-fields-phone': '/action/multiple-fields.html',
//		'#overwrite-action-city': '/action/overwrite-action.html',
//		'#overwrite-action-province': '/action/overwrite-action.html',
//		'#group-password': '/action/group.html',
//		'#group-redirection': '/action/group.html',
//		'.checkbox-vehicule': '/action/checkbox.html',
//		'.radio-gender': '/action/radio.html'
//	};
//
//	module('Initialization');
//	test('Test if field has data-cache attribute', function(assert) {
//		for (var target in requirement) {
//			assert.equal(typeof $.parseJSON($(target).attr('data-cache')), 'object');
//		}
//	});

//	module('Ajax', {
//		setup: function() {
//			sinon.spy($, "ajax");
//		}
//	});
//	test('Test if field is capable to make ajax call', function(assert) {
//		// Drop strange test case for the loop
//		delete requirement['#group-password'];
//		delete requirement['#group-redirection'];
//		delete requirement['.checkbox-vehicule'];
//		delete requirement['.radio-gender'];
//
//		var word = [
//			'friends',
//			'funny',
//			'lip',
//			'trick',
//			'vehicule',
//			'serious',
//			'nervous',
//			'escape'
//		];
//
//		var trigger = function(parameters) {
//			$(parameters.target)
//				.val(parameters.value)
//				.trigger(parameters.event);
//		};
//
//		var current = 0;
//		for (var target in requirement) {
//			var value = word[Math.floor(Math.random() * word.length)];
//			trigger({
//				'target': target,
//				'value': value,
//				'event': 'blur'
//			});
//
//			assert.equal($.ajax.getCall(current).args[0].url, requirement[target]);
//			current = current + 1;
//		}
//	});
});
