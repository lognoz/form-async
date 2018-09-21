# JavaScript Autosave [![travis-img-url](https://travis-ci.org/lognoz/js-autosave.svg?branch=master)](https://travis-ci.org/lognoz/js-autosave)

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

## Setup
You can configure your autosave with jQuery selector.
```js
$(".exemple").autosave();
```

There are two ways to create a DOM element that can be used by JavaScript Autosave. The library uses the `action` by default or the `data-action` of your selector for your ajax call. You can also overwrite the ajax call by using `data-action` on your form element (`input`, `select`, `textarea`).

**Initialization with action**

```html
<form action="/path/to/ajax.html" method="post" class="exemple">
  <input type="text" name="xs_username" value="" placeholder="Username">
</form>
```

**Initialization with data-action**
```html
<input type="text" name="xs_username" class="exemple" data-action="/path/to/ajax.html" >
```

**Overwrite action for xs_phone**
```html
<form action="/path/to/ajax.html" method="post" class="exemple">
  <input type="text" name="xs_username">
  <input type="text" name="xs_phone" data-action="/path/to/overwrite.html">
</form>
```

## Send group of field

To create a group, you can use the `data-group` attribute.
```html
<input type="text" name="xs_username" data-group="xs_username,xs_token">
<input type="hidden" name="xs_token" value="D3YrsxHKPM" data-group="xs_username,xs_token">
```

```js
{
  "xs_username": "a",
  "xs_token": "D3YrsxHKPM"
}
```

## Contenteditable

If you want to use `contenteditable` as form element, you can use the `data-name` attribute.
```html
<div contenteditable="true" class="textarea" data-name="xs_content"></div>
```

## Advanced Options

If you want to catch data returned by JavaScript Autosave before sending ajax request, you can set `before` function. It can be useful to validate your form content. You will need to return `true` if you want to procceed the ajax call.
```js
$(".exemple").autosave({
  before : function (parameter) {
    return true;
  }
});
```

You can process your ajax data return. If MySQL update request is not successful, you can forward it to your fail function.

To use `fail` function, you need to set a function as an option. JavaScript Autosave will call it if ajax request is not working or if you forward your success function to this one.

To improve user experience, you can use `parameter` send as arguments for output retry message and a link that will resend the ajax request. For instance, if you want to use it, you will simply need `parameter.retry` function and send a jQuery selector.

**Basic usage**
```js
var func = {
  before : function (parameter) {
    if (parameter.data !== "")
      return true;
  },
  success : function (data, parameter) {
    if (!data)
      func.fail(parameter);
  },
  fail : function (parameter) {
    parameter.retry($(".retry"));
  }
};

$(".exemple").autosave(func);
```

**Custom retry message**
```js
var func = {
  fail : function (parameter) {
    parameter.retry($(".retry"), "Sorry, an error happened, please <a href=\"#\">try again</a>.");
  }
};
```

Autosave will send an object to your custom function `before`, `success` and `fail`.

***parameter.action***<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ajax page called define with your action attribute.

***parameter.before***<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Element value before the update.

***parameter.data***<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Value list of element updated.

***parameter.retry***<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Function that can be use to output a "try again" message.

***parameter.target***<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;jQuery selector updated.
