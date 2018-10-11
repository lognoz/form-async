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

1. Download the [latest release](https://github.com/lognoz/js-autosave/releases/latest), or better yet install it with [npm](https://www.npmjs.com/package/js-autosave) or [bower](https://bower.io/search/?q=js-autosave).

2. Add the plugin script and initialise it on your form.
```html
<form action="/path/to/ajax.html" method="post" id="exemple">
  <input type="text" name="xs_username">
</form>

<script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
<script src="path/to/js-autosave.js"></script>
<script>
  $("#exemple").autosave();
</script>
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
