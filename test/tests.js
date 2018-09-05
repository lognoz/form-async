$(document).ready(function() {
	var server = null;

	module('Test case', {
		setup: function() {
			server = sinon.fakeServer.create();
			server.respondWith('response');
			$('.exemple').autosave();
		}
	});

	test('self initialisation with data-action', function(assert) {
		var spy = sinon.spy($, "ajax");
		var data = $('#simple-field').attr('data-cache');

		$('#simple-field')
			.val('apple')
			.trigger('blur');

		assert.ok(data);
		assert.ok($.ajax.calledWithMatch({ url: '/action/unique-field.html' }));
		assert.ok($.ajax.calledWithMatch({ data: {'xs_username': 'apple'} }));

		server.respond();
		assert.ok(spy.called);
		assert.ok($('#simple-field').attr('data-cache') != data);

		spy.restore();
	});

	test('form initialisation with action', function(assert) {
		var spy = sinon.spy($, "ajax");
		var data = {
			name: $('#multiple-fields-name').attr('data-cache'),
			phone: $('#multiple-fields-phone').attr('data-cache')
		};

		$('#multiple-fields-name')
			.val('apple')
			.trigger('blur');

		assert.ok(data.name);
		assert.ok($.ajax.calledWithMatch({ url: '/action/multiple-fields.html' }));
		assert.ok($.ajax.calledWithMatch({ data: {'xs_name': 'apple'} }));

		server.respond();

		$('#multiple-fields-phone')
			.val('orange')
			.trigger('blur');

		assert.ok(data.phone);
		assert.ok($.ajax.calledWithMatch({ url: '/action/multiple-fields.html' }));
		assert.ok($.ajax.calledWithMatch({ data: {'xs_phone': 'orange'} }));

		server.respond();

		assert.ok(spy.called);
		assert.ok($('#multiple-fields-name').attr('data-cache') != data.name);
		assert.ok($('#multiple-fields-phone').attr('data-cache') != data.phone);

		spy.restore();
	});

	test('form initialisation with overwriting action', function(assert) {
		var spy = sinon.spy($, "ajax");
		var data = {
			city: $('#overwrite-action-city').attr('data-cache'),
			province: $('#overwrite-action-province').attr('data-cache')
		};

		$('#overwrite-action-city')
			.val('avocado')
			.trigger('blur');

		assert.ok(data.city);
		assert.ok($.ajax.calledWithMatch({ url: '/action/multiple-fields.html' }));
		assert.ok($.ajax.calledWithMatch({ data: {'xs_city': 'avocado'} }));

		server.respond();

		$('#overwrite-action-province')
			.val('blueberrie')
			.trigger('blur');

		assert.ok(data.province);
		assert.ok($.ajax.calledWithMatch({ url: '/action/overwrite-action.html' }));
		assert.ok($.ajax.calledWithMatch({ data: {'xs_province': 'blueberrie'} }));

		server.respond();

		assert.ok(spy.called);
		assert.ok($('#overwrite-action-city').attr('data-cache') != data.city);
		assert.ok($('#overwrite-action-province').attr('data-cache') != data.province);

		spy.restore();
	});

	test('checkbox list', function(assert) {
		var spy = sinon.spy($, "ajax");
		var data = {
			bike: $('#checkbox-bike').attr('data-cache'),
			car: $('#checkbox-car').attr('data-cache')
		};

		$('#checkbox-bike').trigger('click');
		assert.ok(data.bike);
		assert.ok($.ajax.calledWithMatch({ url: '/action/checkbox.html' }));
		assert.ok($.ajax.calledWithMatch({ data: {'xs_vehicule': 'bike'} }));

		server.respond();

		$('#checkbox-car').trigger('click');
		assert.ok(data.car);
		assert.ok($.ajax.calledWithMatch({ url: '/action/checkbox.html' }));
		assert.ok($.ajax.calledWithMatch({ data: {'xs_vehicule': 'bike&car'} }));

		server.respond();

		$('#checkbox-bike').trigger('click');
		assert.ok($.ajax.calledWithMatch({ data: {'xs_vehicule': 'car'} }));

		server.respond();

		assert.ok(spy.called);
		assert.ok($('#checkbox-car').attr('data-cache') != data.car);
		assert.ok($('#checkbox-bike').attr('data-cache') == data.bike);

		spy.restore();
	});

	test('radio list', function(assert) {
		var spy = sinon.spy($, "ajax");
		var data = {
			male: $('#radio-male').attr('data-cache'),
			female: $('#radio-female').attr('data-cache'),
			other: $('#radio-other').attr('data-cache')
		};

		$('#radio-male').trigger('click');
		assert.ok(data.male);
		assert.ok($.ajax.calledWithMatch({ url: '/action/radio.html' }));
		assert.ok($.ajax.calledWithMatch({ data: {'xs_gender': 'Male'} }));

		server.respond();

		$('#radio-female').trigger('click');
		assert.ok(data.female);
		assert.ok($.ajax.calledWithMatch({ url: '/action/radio.html' }));
		assert.ok($.ajax.calledWithMatch({ data: {'xs_gender': 'Female'} }));

		server.respond();

		$('#radio-other').trigger('click');
		assert.ok(data.other);
		assert.ok($.ajax.calledWithMatch({ url: '/action/radio.html' }));
		assert.ok($.ajax.calledWithMatch({ data: {'xs_gender': 'Other'} }));

		server.respond();

		assert.ok(spy.called);
		assert.ok($('#radio-male').attr('data-cache') == data.male);
		assert.ok($('#radio-female').attr('data-cache') == data.female);
		assert.ok($('#radio-other').attr('data-cache') != data.other);

		spy.restore();
	});

	test('send inputs as a group', function(assert) {
		var spy = sinon.spy($, "ajax");
		var data = $('#group-password').attr('data-cache');

		$('#group-password')
			.val('orange')
			.trigger('blur');

		assert.ok(data);
		assert.ok($.ajax.calledWithMatch({ url: '/action/group.html' }));
		assert.ok($.ajax.calledWithMatch({ data: {'xs_password': 'orange', 'xs_redirection': 'index.html'} }));

		spy.restore();
	});
} );
