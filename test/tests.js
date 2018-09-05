$(document).ready(function() {
	var server, spy, options;

	QUnit.module('Test case', {
		beforeEach: function(assert) {
			spy = sinon.spy($, "ajax");
			server = sinon.fakeServer.create();
			server.respondWith('response');
			$('.exemple').autosave();
		},
		afterEach: function(assert) {
			spy.restore();
			server.restore();
		}
	});

	QUnit.test('self initialisation with data-action', function(assert) {
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
	});

	QUnit.test('form initialisation with action', function(assert) {
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
	});

	QUnit.test('form initialisation with overwriting action', function(assert) {
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
	});

	QUnit.test('checkbox list', function(assert) {
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
	});

	QUnit.test('radio list', function(assert) {
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
	});

	QUnit.test('send inputs as a group', function(assert) {
		var data = $('#group-password').attr('data-cache');

		$('#group-password')
			.val('orange')
			.trigger('blur');

		assert.ok(data);
		assert.ok($.ajax.calledWithMatch({ url: '/action/group.html' }));
		assert.ok($.ajax.calledWithMatch({ data: {'xs_password': 'orange', 'xs_redirection': 'index.html'} }));
	});

	QUnit.test('contenteditable', function(assert) {
		var data = $('#contenteditable').attr('data-cache');

		$('#contenteditable')
			.html('mango')
			.trigger('blur');

		assert.ok(data);
		assert.ok($.ajax.calledWithMatch({ url: '/action/contenteditable.html' }));
		assert.ok($.ajax.calledWithMatch({ data: {'xs_content': 'mango'} }));

		server.respond();
		assert.ok(spy.called);
		assert.ok($('#contenteditable').attr('data-cache') != data);
	});

	QUnit.module('Advanced Options', {
		beforeEach: function() {
			spy = sinon.spy($, "ajax");
			server = sinon.fakeServer.create();
			options = {
				before: function(parameters) {
					return (parameters.data['xs_username'] !== 'cantaloupe')
				},
				success: function(data, parameters) {
					if (data == 'redirect') {
						options.fail(parameters);
					} else {
						parameters.target.addClass('success');
					}
				},
				fail: function(parameters) {
					parameters.target.addClass('fail');
					parameters.retry($('#test-case-retry'));
				}
			};

			$('.exemple').autosave(options);
		},
		afterEach: function(assert) {
			spy.restore();
			server.restore();
		}
	});

	QUnit.test('before function', function(assert) {
		$('#simple-field')
			.val('cantaloupe')
			.trigger('blur');

		assert.ok(!spy.called);

		$('#simple-field')
			.val('carambola')
			.trigger('blur');

		assert.ok(spy.called);
		assert.ok($.ajax.calledWithMatch({ data: {'xs_username': 'carambola'} }));
	});

	QUnit.test('success function', function(assert) {
		$('#simple-field')
			.val('clementine')
			.trigger('blur');

		server.respondWith('success');
		server.respond();

		assert.ok($('#simple-field').hasClass('success'));
	});

	QUnit.test('fake a fail response by redirecting', function(assert) {
		$('#simple-field')
			.val('durian')
			.trigger('blur');

		server.respondWith('redirect');
		server.respond();

		assert.ok($('#simple-field').hasClass('fail'));
	});

	QUnit.test('fail function', function(assert) {
		$('#simple-field')
			.val('durian')
			.trigger('blur');

		server.respondWith([ 404, {}, '' ]);
		server.respond();

		assert.ok($('#simple-field').hasClass('fail'));
	});

	QUnit.test('retry link', function(assert) {
		$('#simple-field')
			.val('strawberries')
			.trigger('blur');

		server.respondWith([ 404, {}, '' ]);
		server.respond();
		assert.ok($.ajax.calledWithMatch({ data: {'xs_username': 'strawberries'} }));

		$('#test-case-retry a').trigger('click');
		server.respondWith('success');
		server.respond();
		assert.ok($('#simple-field').hasClass('success'));
	});
});
