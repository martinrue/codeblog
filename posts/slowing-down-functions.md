title: slowing down functions
date: June 17 2013 19:25
---

Slowing down a function seems like a curious thing to do, but often it's quite useful. A common example is when a window is resized and you need to redraw the contents. The simplest solution is to call some `redraw` function each time a window resize event occurs, but you may get 100s per second and don't want to call it for every micro update of the screen.

Let's say we had:

```javascript
var redraw = function() {
  console.log('expensive drawing');
};
```

We can slow down the 'expensive drawing' by moving the costly operations into an inner function (I love JS) and putting a timer around the invocations:

```javascript
var redrawTimer;

var redraw = function() {
  var _redraw = function() {
    console.log('expensive drawing');
  };

  clearTimeout(redrawTimer);
  redrawTimer = setTimeout(_redraw, 1000);
};
```

Now when `redraw` is called it'll wait 1000ms before doing anything. If the function is called earlier than 1000ms, it resets the timer and begins another period of waiting.

And, unsurprisngly, [underscore](http://underscorejs.org/) makes this even easier with its [debounce](http://underscorejs.org/#debounce) function:

```javascript
var redraw = function() {
  console.log('expensive drawing');
};

var slothRedraw = _.debounce(redraw, 1000);
```
