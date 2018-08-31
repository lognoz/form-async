$(document).ready(function(){
	$('.exemple').autosave({
		success: {},
		fail: {}
	});

	module('Initialization');
	test('Test if field has data-cache attribute', function(assert) {
		var data = function(target) {
			return $.parseJSON($(target).attr('data-cache'));
		}

		assert.equal(typeof data('#simple-field'), 'object');
		assert.equal(typeof data('#multiple-fields-name'), 'object');
		assert.equal(typeof data('#multiple-fields-phone'), 'object');
	});

	module('Test if field is capable to make ajax call', {
		setup: function() {
			sinon.spy($, "ajax");
		}
	});
});
