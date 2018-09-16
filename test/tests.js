$(document).ready(function() {
	var server, spy, options;

	QUnit.module('Test case', {
		beforeEach: function(assert) {
			$('.exemple').autosave();
			spy = sinon.spy($, "ajax");
			server = sinon.fakeServer.create();
			server.respondWith('response');
		},
		afterEach: function(assert) {
			spy.restore();
			server.restore();
		}
	});

	QUnit.test('self initialisation with data-action', function(assert) {
		$('#simple-field')
			.val('apple')
			.trigger('blur');

		assert.ok(spy.called);
		assert.ok($('#simple-field').attr('data-autosave-id'));
		assert.ok($.ajax.calledWithMatch({ url: '/action/unique-field.html' }));
		assert.ok($.ajax.calledWithMatch({ data: {'xs_username': 'apple'} }));

		server.respond();
	});

	QUnit.test('form initialisation with action', function(assert) {
		$('#multiple-fields-name')
			.val('apple')
			.trigger('blur');

		assert.ok(spy.called);
		assert.ok($('#multiple-fields-name').attr('data-autosave-id'))
		assert.ok($.ajax.calledWithMatch({ url: '/action/multiple-fields.html' }));
		assert.ok($.ajax.calledWithMatch({ data: {'xs_name': 'apple'} }));

		server.respond();

		$('#multiple-fields-phone')
			.val('orange')
			.trigger('blur');

		assert.ok(spy.called);
		assert.ok($('#multiple-fields-phone').attr('data-autosave-id'))
		assert.ok($.ajax.calledWithMatch({ url: '/action/multiple-fields.html' }));
		assert.ok($.ajax.calledWithMatch({ data: {'xs_phone': 'orange'} }));

		server.respond();
	});

	QUnit.test('form initialisation with overwriting action', function(assert) {
		$('#overwrite-action-city')
			.val('avocado')
			.trigger('blur');

		assert.ok(spy.called);
		assert.ok($('#overwrite-action-city').attr('data-autosave-id'));
		assert.ok($.ajax.calledWithMatch({ url: '/action/multiple-fields.html' }));
		assert.ok($.ajax.calledWithMatch({ data: {'xs_city': 'avocado'} }));

		server.respond();

		$('#overwrite-action-province')
			.val('blueberrie')
			.trigger('blur');

		assert.ok(spy.called);
		assert.ok($('#overwrite-action-province').attr('data-autosave-id'));
		assert.ok($.ajax.calledWithMatch({ url: '/action/overwrite-action.html' }));
		assert.ok($.ajax.calledWithMatch({ data: {'xs_province': 'blueberrie'} }));

		server.respond();
	});

	QUnit.test('checkbox list', function(assert) {
		var data = {
			bike: $('#checkbox-bike').attr('data-cache'),
			car: $('#checkbox-car').attr('data-cache')
		};

		$('#checkbox-bike').trigger('click');
		server.respond();

		assert.ok(spy.called);
		assert.ok($('#checkbox-bike').attr('data-autosave-id'));
		assert.ok($.ajax.calledWithMatch({ url: '/action/checkbox.html' }));
		assert.ok($.ajax.calledWithMatch({ data: {'xs_vehicule': ['bike']} }));

		$('#checkbox-car').trigger('click');
		server.respond();

		assert.ok(spy.called);
		assert.ok($('#checkbox-car').attr('data-autosave-id'));
		assert.ok($.ajax.calledWithMatch({ url: '/action/checkbox.html' }));
		assert.ok($.ajax.calledWithMatch({ data: {'xs_vehicule': ['bike', 'car']} }));

		$('#checkbox-bike').trigger('click');
		server.respond();

		assert.ok(spy.called);
		assert.ok($.ajax.calledWithMatch({ data: {'xs_vehicule': ['car']} }));
	});

	QUnit.test('radio list', function(assert) {
		$('#radio-male').trigger('click');
		server.respond();

		assert.ok(spy.called);
		assert.ok($('#radio-male').attr('data-autosave-id')),
		assert.ok($.ajax.calledWithMatch({ url: '/action/radio.html' }));
		assert.ok($.ajax.calledWithMatch({ data: {'xs_gender': 'Male'} }));

		$('#radio-female').trigger('click');
		server.respond();

		assert.ok(spy.called);
		assert.ok($('#radio-female').attr('data-autosave-id')),
		assert.ok($.ajax.calledWithMatch({ url: '/action/radio.html' }));
		assert.ok($.ajax.calledWithMatch({ data: {'xs_gender': 'Female'} }));

		$('#radio-other').trigger('click');
		server.respond();

		assert.ok(spy.called);
		assert.ok($('#radio-other').attr('data-autosave-id'))
		assert.ok($.ajax.calledWithMatch({ url: '/action/radio.html' }));
		assert.ok($.ajax.calledWithMatch({ data: {'xs_gender': 'Other'} }));
	});

	QUnit.test('send inputs as a group', function(assert) {
		$('#group-password')
			.val('orange')
			.trigger('blur');

		assert.ok(spy.called);
		assert.ok($('#group-password').attr('data-autosave-id'));
		assert.ok($.ajax.calledWithMatch({ url: '/action/group.html' }));
		assert.ok($.ajax.calledWithMatch({ data: {'xs_password': 'orange', 'xs_redirection': 'index.html'} }));

		server.respond();
	});

	QUnit.test('contenteditable', function(assert) {
		$('#contenteditable')
			.html('mango')
			.trigger('blur');

		assert.ok(spy.called);
		assert.ok($('#contenteditable').attr('data-autosave-id'));
		assert.ok($.ajax.calledWithMatch({ url: '/action/contenteditable.html' }));
		assert.ok($.ajax.calledWithMatch({ data: {'xs_content': 'mango'} }));

		server.respond();
	});

	QUnit.module('Advanced Options', {
		beforeEach: function() {
			spy = sinon.spy($, "ajax");
			server = sinon.fakeServer.create();
			options = {
				before: function() {
					return (this.data['xs_username'] !== 'cantaloupe')
				},
				success: function(data) {
					if (data == 'redirect')
						options.fail();
					else
						$(this.selector).addClass('success');
				},
				fail: function(parameters) {
					$(this.selector).addClass('fail');
					this.retry('#test-case-retry');
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
