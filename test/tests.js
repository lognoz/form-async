$(document).ready(function(){
	$('.exemple').autosave({
		success: {},
		fail: {}
	});

	var requirement = {
		'#simple-field': '/action/unique-field.html',
		'#multiple-fields-name': '/action/multiples-fields.html',
		'#multiple-fields-phone': '/action/multiples-fields.html',
		'#overwrite-action-city': '/action/overwrite-action.html',
		'#overwrite-action-province': '/action/overwrite-action.html',
		'#group-password': '/action/group.html',
		'#group-redirection': '/action/group.html',
		'.checkbox-vehicule': '/action/checkbox.html',
		'.radio-gender': '/action/radio.html'
	};

	module('Initialization');
	test('Test if field has data-cache attribute', function(assert) {
		for (var target in requirement) {
			assert.equal(typeof $.parseJSON($(target).attr('data-cache')), 'object');
		}
	});

	module('Ajax', {
		setup: function() {
			sinon.spy($, "ajax");
		}
	});
	test('Test if field is capable to make ajax call', function(assert) {
		// Drop strange test case for the loop
		delete requirement['#group-password'];
		delete requirement['#group-redirection'];
		delete requirement['.checkbox-vehicule'];
		delete requirement['.radio-gender'];

		var word = [
			'friends',
			'funny',
			'lip',
			'trick',
			'vehicule',
			'serious',
			'nervous',
			'escape'
		];

		var trigger = function(parameters) {
			$(parameters.target)
				.val(parameters.value)
				.trigger(parameters.event);
		};
	});
});
