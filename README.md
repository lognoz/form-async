# Form Async

<a href="https://www.npmjs.com/package/form-async"><img src="https://img.shields.io/npm/v/form-async.svg?style=flat-square"></a>
<a href="https://travis-ci.org/lognoz/form-async"><img src="https://img.shields.io/travis/lognoz/form-async/master.svg?style=flat-square" alt="Build Status"></a>

Form Async is an easy-to-use library that provide acronymous sending on form changes. It's a great solution to preventing data loss when filling out a web form.

## Features

- Lightweight (~1.5kb gziped)
- Saves any HTML form element
- Support content editable property
- Full customization
- Retry functionality if ajax request fail
- Send form elements as group of field
- Provide the way to validate changes before sending ajax request
- Heavily tested

## Installation

``` bash
$ npm install form-async
```

We recommend installing from npm and then using a module bundler such as [RequireJS](https://requirejs.org), [Webpack](https://webpack.js.org) or [Browserify](http://browserify.org).

Alternatively, you can use [jsdelivr CDN](https://www.jsdelivr.com/package/npm/form-async) instead of npm.

```html
<!-- 1. Add JS before the closing `</body>` -->
<script src="jquery.js"></script>
<script src="form-async.js"></script>

<!-- 2. Initialize -->
<form action="/ajax/account">
   <input name="xs_username">
</form>

<script>
   $("form").async();
</script>
```
## Documentation
**[Read the docs](https://code.lognoz.org/form-async/)** for more details on how to use Form Async.

### Callbacks
- [`before`](https://code.lognoz.org/form-async/callbacks/before/) — pre-request function that can be use to validate data before it is sent
- [`success`](https://code.lognoz.org/form-async/callbacks/success/) — function invoked if the request succeeds
- [`error`](https://code.lognoz.org/form-async/callbacks/error/) — function invoked if the request fails

## Software
We use Browserstack for manual testing
<a href="https://www.browserstack.com" target="_blank">
  <img align="left" width="117" alt="BrowserStack logo" src="https://i.ibb.co/HDRDHmx/Browserstack-logo-2x.png">
</a>
