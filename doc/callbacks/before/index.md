---
layout: wrapper
title: "Before callback - Form Async"
---

# Before callback
A pre-request callback function that can be use to validate data before it is sent.

```javascript
$("form").async({
  before: function(request) {
    // Your code here
  }
});
```

## Trigger a validation
Valide the input content and throw an error if it's not an alphanumeric.

```javascript
$("form").async({
  before: function(request) {
    var value = $(this).val();

    if (/[^a-zA-Z0-9]/.test(value)) {
      $(this).addClass("error");
    } else {
      $(this).removeClass("error");
    }
  }
});
```

### Demo

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
      <span>Status</span>
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
        var value = $(this).val();
        var name = request.attribute.name;

        if (/[^a-zA-Z0-9]/.test(value)) {
          $(this).addClass("error");
          result[name] = "<span style='color: red;'>error</span>";
        } else {
          $(this).removeClass("error");
          result[name] = "<span style='color: green;'>success</span>";
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
