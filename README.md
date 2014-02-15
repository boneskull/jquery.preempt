# jquery.preempt

[![Build Status](https://travis-ci.org/boneskull/jquery.preempt.png?branch=master)](https://travis-ci.org/boneskull/jquery.preempt)
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

[jQuery](http://jquery.com) plugin to take legacy inline JS (i.e. `onclick`
and `href="javascript:..."`) and create event handlers to be run before or
after the inlined code (or both!).

> #### (Why would I need this?)
> My use case was that I was writing a [GreaseMonkey](https://addons.mozilla
.org/en-US/firefox/addon/greasemonkey/)-like [script](https://github
.com/boneskull/fb-bugmonkey-markdown) against a page with inline JS and my
jQuery events were not behaving.  Works for me; your mileage may vary.

## Usage

```javascript

// given <button onclick="doSomething()">do something</button>
// or <a href="javascript:doSomethingElse()">do something else</a>

// Basic usage:
$('button').preempt({
  attr: 'onclick',
  event: 'click',
}, function doSomethingBeforeSomething() {
  // do something else
});

// Restoring the inline JS:
$('button').preempt({
  attr: 'onclick',
  event: 'click',
  restore: true
});

// Fancy usage:
$('button').preempt({
  attr: 'onclick',
  event: 'click',
  before: function executedBeforeInlineJS(event, data) {
    // stuff; return false to halt propagation to inline JS
  },
  after: function exectedAfterInlineJS(event, data) {
    // things; return false to prevent the default action and stop propagation
  },
  // will execute the after() function even if the inlined JS returned false.
  forcePropagation: true,
  data: {
    before: 'some data to be passed to the before() function',
    after: 'some data to be passed to the after() function',
  }
});
```

## Author
[Christopher Hiller](http://boneskull.github.io)
