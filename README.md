# JavaScript Autosave [![travis-img-url](https://travis-ci.org/lognoz/js-autosave.svg)](https://travis-ci.org/lognoz/js-autosave) [![Code Climate](https://codeclimate.com/github/lognoz/js-autosave.svg)](https://codeclimate.com/github/lognoz/js-autosave)

Making good form that improves user experience is not supposed to be hard to do. Many web developers prefer to prioritize time production over quality. JavaScript Autosave is the simplest, fastest way to send ajax request when form changes.

## Installation

Include jQuery library, you can use cdn from [jquery.com](http://jquery.com/download/)
```html
<script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
```

### Direct download
Include it via [jsDelivr CDN](https://www.jsdelivr.com/package/npm/js-autosave)
```html
<script src="https://cdn.jsdelivr.net/npm/js-autosave/src/js.autosave.js"></script>
```

Or download the script [here](https://github.com/lognoz/js-autosave/blob/master/src/js.autosave.js) and include it
```html
<script src="/path/to/js.autosave.js"></script>
```

### Package Managers
You can get it on [npm](https://www.npmjs.com/package/js-autosave) or on [bower](https://bower.io/search/?q=js-autosave) under the name `js-autosave`.

## Setup
You can configure your autosave with jQuery selector.
```js
$(".exemple").autosave();
```

There are two ways to create a DOM element that can be used by JavaScript Autosave. The library uses the `action` by default or the `data-action` of your selector for your ajax call. You can also overwrite the ajax call by using `data-action` on your form element (`input`, `select`, `textarea`).

***Initialization with action***

```html
<form action="action/ajax-01.html.php" method="post" class="exemple">
  <input type="text" name="xs_username" value="" placeholder="Username">
</form>
```

***Initialization with data-action***
```html
<input type="text" name="xs_username" class="exemple" data-action="action/ajax-01.html.php" >
```

***Overwrite action for xs_phone***
```html
<form action="action/ajax-01.html.php" method="post" class="exemple">
  <input type="text" name="xs_username">
  <input type="text" name="xs_phone" data-action="action/ajax-02.html.php">
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

***Basic usage***
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

***Custom retry message***
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
