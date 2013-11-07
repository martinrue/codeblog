tags: async javascript
title: from sync to async
preview: Processing a collection of things in JavaScript is pretty easy, but what happens when we need to do it asynchronously?
date: October 12 2013 11:45
---
Processing a collection of things in JavaScript is pretty easy. Using [underscore](http://underscorejs.org) for example:

```javascript
var numbers = [1, 2, 3, 4, 5];

var getParity = function(number) {
  return number % 2 === 0 ? 'even' : 'odd';
};

var parities = _.map(numbers, getParity);
console.log(parities);

// -> ["odd", "even", "odd", "even", "odd"]
```

Because the operation is synchronous (meaning we block and wait for things to finish before execution continues) the code is top to bottom and fairly easy to understand. But what if `getParity` resembled something more day-to-day, such as making a database call or an HTTP request?

Quickly we're thrown into an asynchronous world. Let's simulate this by making `getParity` pretend to be asynchronous by waiting 50ms before giving us a result back:

```javascript
var getParity = function(number, callback) {
  setTimeout(function() {
    return callback(number % 2 === 0 ? 'even' : 'odd');
  }, 50);
};
```

`getParity` requires a number, just as before, but now also requires a `callback` function which is called later with the final result. The body of the function now waits 50ms and then calls `callback` with `'odd'` or `'even'`.

Calling `getParity` once is now a little more involved, but is still easy enough:

```javascript
var getParity = function(number, callback) {
  setTimeout(function() {
    return callback(number % 2 === 0 ? 'even' : 'odd');
  }, 50);
};

getParity(7, function(parity) {
  console.log(parity);
});

// -> "odd"
```

The difficulty comes when we want to call it for a collection of numbers, as we did in the first example using [underscore's](http://underscorejs.org) `_.map`. This, of course, doesn't work anymore:

```javascript
var numbers = [1, 2, 3, 4, 5];

var getParity = function(number, callback) {
  setTimeout(function() {
    return callback(number % 2 === 0 ? 'even' : 'odd');
  }, 50);
};

var parities = _.map(numbers, getParity);
console.log(parities);

// -> [undefined, undefined, undefined, undefined, undefined]
```

The trouble is, `_.map` is a synchronous function. It expects its iterator to return the mapped value via the `return` keyword and has no concept of the value being calculated in the future. In other words, we simply can't use [underscore](http://underscorejs.org) for this.

We need something more. Specifically, we need something just like [underscore](http://underscorejs.org), but with the ability to compute the mapped result by providing a completion callback and waiting for it. And indeed then waiting for all individual completions before giving us back the final mapped result.

This something is [async.js](https://github.com/caolan/async).

With [async.js](https://github.com/caolan/async) we have a familiar set of functions (`async.each`, `async.filter`, `async.map`, `async.reduce` etc.) which are all intended to work with asynchronous iterators:

```javascript
var numbers = [1, 2, 3, 4, 5];

var getParity = function(number, callback) {
  setTimeout(function() {
    return callback(null, number % 2 === 0 ? 'even' : 'odd');
  }, 50);
};

async.map(numbers, getParity, function(err, parities) {
  console.log(parities);
});

// -> ["odd", "even", "odd", "even", "odd"]
```

You'll notice the structure has changed slightly to accomodate the new asynchronicity. The first thing to spot is that we now pass `null` as the first argument to `getParity`'s callback. This is because the callback given to us is now being provided by [async.js](https://github.com/caolan/async) and this is how asynchronous error handling works.

The second thing to notice is that we no longer care about a return value from the map function – we know it's asynchronous, so the result must be provided to us later via a callback. As a result, the map now requires three arguments: the collection, the iterator function and the final callback for once the map is complete.

If all of the iterators complete without passing an error to their own callback (the first parameter), `err` here in the final callback will be `null`. Otherwise it'll be the error from the first iterator that failed and interrupted the map.

And there we have it – from synchronous to asynchronous.

**Bonus Points**

You'll recall that we were delaying each result by 50ms and we had 5 numbers in the array, so how long do you think we waited for the asynchronous map to complete?

~250ms?

The asynchronous map completed in ~50ms, and here's the major benefit of asynchronous code – it's overlapped. A JavaScript process runs in a single thread, and so instead of threaded code to seemingly do multiple things at once, JavaScript is evented.

Internally, the `setTimeout` causes the execution to yield and continue on, queueing its callback for once the operation completes internally. In the meantime, execution continues and more than likely creates many more deferred things for the queue to handle, never blocking the primary thread of execution.

In our mapping example, it queues five timeout events very quickly (in as long as it takes for 5 x `setTimeout` to be called) and waits for their callbacks to be executed. After ~50ms, at roughly the same time each of the callbacks are invoked, effectively giving back values to [async.js](https://github.com/caolan/async), which then calls our final callback to notify us that the operation has completed.

The result is very efficient execution, where threads are not simply blocked because they need to be blocked due to the linear execution flow. With this comes a lot of flexibility too. You can call `async.mapSeries` if you like, and cause items to be processed serially one-by-one. You can even control the degree of parallelism used in the non-series versions of functions via the `limit` setting.

So make sure both [underscore](http://underscorejs.org) and [async.js](https://github.com/caolan/async) are on your toolbelt. Depending on whether code is synchronous or asynchronous, they make writing clean JavaScript a ton easier.