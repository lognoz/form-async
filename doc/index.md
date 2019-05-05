---
layout: wrapper
title: "Documentation - Form Async"
description: "Form Async is the simplest, fastest way to send ajax request when
   form changes. It's a great solution to preventing data loss when filling out
   a web form."
---

# What is Form Async?
Form Async is the simplest, fastest way to send ajax request when form changes.
A great jQuery solution to preventing data loss when filling out a web form.

**Write some texts and unblur the input to see the result.**

{:.hidden .demo}
```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Form-async example</title>
  <link rel="stylesheet" href="/assets/css/demo.css">
</head>
<body id="example-01">
  <form action="/" method="post" class="exemple">
    <div class="flex-col">
      <div class="field">
        <input type="text" name="xs_name" placeholder="Name" autocomplete="off">
      </div>
      <div class="field">
        <input type="text" name="xs_phone" placeholder="Phone" autocomplete="off">
      </div>
    </div>
  </form>

  <div class="result-wrapper">
    <div class="result-header">
      <span>Ajax data</span>
    </div>
    <div class="result-body">
       <pre><code>{}</code></pre>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/jquery/dist/jquery.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/form-async/dist/form-async.min.js"></script>
  <script>
    function convert_to_line(pre) {
      $(".line-number").remove();

      var pl = pre.length;

      pre.innerHTML = '<span class="line-number"></span>' + pre.innerHTML + '<span class="cl"></span>';
      var num = pre.innerHTML.split(/\n/).length;

      for (var j = 0; j < num; j++) {
          var line_num = pre.getElementsByTagName('span')[0];
          line_num.innerHTML += '<span>' + (j + 1) + '</span>';
      }
    }

    convert_to_line($("pre")[0]);

    $("form").submit(function() {
      return false;
    });

    $(".exemple").async({
      before: function(request) {
        var result = {};

        for (name in request.data) {
          result[name] = String(request.data[name])
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
        }

        $("code").html(JSON.stringify( result, null, 3 ));
        convert_to_line($("pre")[0]);

        request.abort();
      }
    });
  </script>
<body>
</html>
```

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

### Add JS before the closing </body>

```html
<script src="jquery.js"></script>
<script src="form-async.js"></script>
```

### Select a form to synchronise and call the async method
```html
<form action="/ajax/account">
   <input name="xs_username">
</form>

<script>
   $("form").async();
</script>
```
