$(document).ready(function(){
	var server = null;

	module('Test case', {
		setup: function() {
			server = sinon.fakeServer.create();
			server.respondWith('response');

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
		var spy = sinon.spy($, "ajax");
		var data = $('#simple-field').attr('data-cache');

		$('#simple-field')
			.val('apple')
			.trigger('blur');

		assert.ok(data);
		assert.ok($.ajax.calledWithMatch({ url: '?action=unique-field.html' }));
		assert.ok($.ajax.calledWithMatch({ data: {'xs_username': 'apple'} }));

		server.respond();
		assert.ok(spy.called)
		assert.ok($('#simple-field').attr('data-cache') != data);

		spy.restore();
	});

	test('form initialisation with action', function(assert) {
		var spy = sinon.spy($, "ajax");

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

		spy.restore();
	});

//	test('form initialisation with overwriting action', function(assert) {
//		var save = sinon.spy($, "ajax");
//
//		$('#overwrite-action-city')
//			.val('avocado')
//			.trigger('blur');
//
//		assert.ok($('#overwrite-action-city').attr('data-cache'));
//		assert.ok($.ajax.calledWithMatch({ url: '/action/multiple-fields.html' }));
//		assert.ok($.ajax.calledWithMatch({ data: {'xs_city': 'avocado'} }));
//
//		$('#overwrite-action-province')
//			.val('blueberrie')
//			.trigger('blur');
//
//		assert.ok($('#overwrite-action-province').attr('data-cache'));
//		assert.ok($.ajax.calledWithMatch({ url: '/action/overwrite-action.html' }));
//		assert.ok($.ajax.calledWithMatch({ data: {'xs_province': 'blueberrie'} }));
//
//		save.restore();
//	});

//	test('checkbox list', function(assert) {
//		var save = sinon.spy($, "ajax");
//
//
//		$('#checkbox-bike').trigger('click');
//		assert.ok($('#checkbox-bike').attr('data-cache'));
//		assert.ok($.ajax.getCall(0).args[0].url == 'index.html');
//
//
//		$('#checkbox-car').trigger('click');
//		$('#checkbox-bike').trigger('click');
//
//		console.log($.ajax.getCall(0).args[0])
//		console.log($.ajax.getCall(1).args[0])
//		console.log($.ajax.getCall(2).args[0])
//
//		save.restore();
//	});
});
