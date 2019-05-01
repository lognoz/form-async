---
title: How Form Async Works - Form Async
description: Form Async is the simplest, fastest way to send ajax request when
   form changes. It's a great solution to preventing data loss when filling out
   a web form.
---

# How Form Async Works
Form Async is the simplest, fastest way to send ajax request when form changes.
A great jQuery solution to preventing data loss when filling out a web form.

**Write some texts and unblur the input to see the result.**

## Features
- Lightweight (~1.5kb gziped).
- Saves any HTML form element.
- Support content editable property.
- Full customization.
- Retry functionality if ajax request fail.
- Send form elements as group of field.
- Provide the way to validate changes before sending ajax request.
- Heavily tested.

## Installation
We recommend installing from npm and then using a module bundler such as
[RequireJS](https://requirejs.org), [Webpack](https://webpack.js.org) or
[Browserify](http://browserify.org). Alternatively, you can use [jsdelivr
CDN](https://www.jsdelivr.com/package/npm/form-async) instead of npm.

### Add JS before the closing `</body>`

Include jQuery and the plugin on a page. Then select a form to synchronise and
call the async method.
```html
<script src="jquery.js"></script>
<script src="form-async.js"></script>

<form action="/ajax/account">
   <input name="xs_username">
</form>

<script>
   $("form").async();
</script>
```
