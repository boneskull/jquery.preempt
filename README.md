#jquery.preempt

[![Build Status](https://travis-ci.org/boneskull/jquery.preempt.png?branch=master)](https://travis-ci.org/boneskull/jquery.preempt)
[![Coverage Status](https://coveralls.io/repos/boneskull/jquery.preempt/badge.png)](https://coveralls.io/r/boneskull/jquery.preempt)
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

[jQuery](http://jquery.com) plugin to take legacy inline JS (i.e. `onclick` and `href="javascript:..."` and create an event handler to be run *before* the inlined code.

> ####(Why would I need this?)
> My use case was that I was writing a [GreaseMonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) script against code with inline JS
and my bindings were not behaving.  Works for me; your mileage may vary.

##Usage

```javascript

// given <button onclick="doSomething()">do something</button>
// or <a href="javascript:doSomethingElse()">do something else</a>
$('button').preempt({
  attr: 'onclick',
  event: 'click',
}, function doSomethingBeforeSomething() {
  // do something else
});

// restores the `onclick` attribute of the element
$('button').preempt({
  attr: 'onclick',
  event: 'click',
  restore: true
});
```

##Author
[Christopher Hiller](http://boneskull.github.io)
