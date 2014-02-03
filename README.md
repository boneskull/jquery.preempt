#jquery-preempt

[jQuery](http://jquery.com) plugin to take legacy inline JS (i.e. `onclick` and `href=\"javascript:...\"` and create an event handler to be run *before* the inlined code.

> #### (Why would I need this?)
> My use case was that I was writing a [GreaseMonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) script against code with inline JS
and my bindings were not behaving.  Works for me; your mileage may vary.

## Usage

```javascript

// given <button onclick="doSomething()">do something</button>
// or <a href="javascript:doSomethingElse()">do something else</a>
$('button').preempt('onclick', 'click', function doSomethingBeforeSomething() {
  // do something else
});
// restores the `onclick` attribute of the element
$('button').restore('onclick', 'click');
```

