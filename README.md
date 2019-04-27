# Form Async [![travis-img-url](https://travis-ci.org/lognoz/form-async.svg?branch=master)](https://travis-ci.org/lognoz/form-async)

Form Async is the simplest, fastest way to send ajax request when form changes.

## Features

* Lightweight (~1.5kb gziped).
* Saves any HTML form element.
* Support content editable property.
* Full customization.
* Retry functionality if ajax request fail.
* Send form elements as group of field.
* Provide the way to validate changes before sending ajax request.
* Heavily tested.

## Getting Started

### Installation

Download the [latest release](https://github.com/lognoz/form-async/releases/latest), or better yet install it with [npm](https://www.npmjs.com/package/form-async).

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

### before
A pre-request callback function that can be use to validate data before it is sent.

```js
$( "form" ).async( {
  before: function( request ) {
    if( /[^a-zA-Z0-9]/.test( $( this ).val() ) {
      request.abort();
    }
  }
} );
```

### success
A callback function invoked if the request succeeds. The function gets passed one argument: the data returned from the server.

```js
$( "form" ).async( {
  success: function( response, request ) {
    $( this ).addClass( "success" );
  }
} );
```

### error
A callback function invoked if the request fails.

```js
$( "form" ).async( {
  success: function( response, request ) {
    if ( response === "error" ) {
      request.error();
    }
  },
  error: function( request ) {
    $( this ).addClass( "error" );
  }
} );
```
