# Form Async [![travis-img-url](https://travis-ci.org/lognoz/js-autosave.svg?branch=master)](https://travis-ci.org/lognoz/js-autosave)

Making good form that improves user experience is not supposed to be hard to do. JavaScript Autosave is the simplest, fastest way to send ajax request when form changes.

## Features

* Lightweight (~1.5kb gziped).
* Saves any HTML form element.
* Support content editable property.
* Full customization.
* Clear the field if it not matches support.
* Retry functionality if ajax call fail.
* Send form elements as group of field.
* Provide the way to validate changes before sending ajax call.
* Heavily tested.

## Getting Started

### Installation

Download the [latest release](https://github.com/form-async/form-async/releases/latest), or better yet install it with [npm](https://www.npmjs.com/package/form-async) or [bower](https://bower.io/search/?q=form-async).

### Including it on your page

Include jQuery and the plugin on a page. Then select a form to synchronise and call the `async` method.

```html
<form action="ajax.html">
   <input name="xs_username">
</form>

<script src="jquery.js"></script>
<script src="form-async.js"></script>
<script>
  $( "form" ).async();
</script>
```

Alternatively include jQuery and the plugin via requirejs in your module.

```js
define( [ "jquery", "form-async" ], function( $ ) {
   $( "form" ).async();
} );
```

## Callbacks

**before**  
Type: `Function` Default: `null`  
A pre-request callback function that can be use to validate data before it is sent. Must return `true` to establish ajax request.

**success**  
Type: `Function` Default: `null`  
A callback function invoked if the request succeeds. The function gets passed one argument: the data returned from the server.

**fail**  
Type: `Function` Default: `null`  
A callback function invoked if the request fails.
