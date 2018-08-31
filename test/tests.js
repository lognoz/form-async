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
		var data = function(target) {
			return $.parseJSON($(target).attr('data-cache'));
		}

		assert.equal(typeof data('#simple-field'), 'object');
		assert.equal(typeof data('#multiple-fields-name'), 'object');
		assert.equal(typeof data('#multiple-fields-phone'), 'object');
		assert.equal(typeof data('#overwrite-action-city'), 'object');
		assert.equal(typeof data('#overwrite-action-province'), 'object');
		assert.equal(typeof data('#group-password'), 'object');
		assert.equal(typeof data('#group-redirection'), 'object');
		assert.equal(typeof data('.checkbox-vehicule'), 'object');
		assert.equal(typeof data('.radio-gender'), 'object');
	});

	module('Ajax', {
		setup: function() {
			sinon.spy($, "ajax");
		}
	});
	test('Test if field is capable to make ajax call', function(assert) {

	});
});
