title: async collection processing pattern
date: October 12 2013 21:58
---
In the [last post](http://code.martinrue.com/posts/sync-to-async) I talked about transitioning from synchronous to asynchronous code in JavaScript, introducing the library [async.js](https://github.com/caolan/async).

Day-to-day I use [async.js](https://github.com/caolan/async) quite a lot. It really helps with asynchronous control flow, and there's certainly a lot of that in JavaScript.

I've started to notice a nice little pattern I use when it comes to processing over a collection of items asynchronously.

I create an outer function `doThings` (the plural), containing an inner function `doThing` (the singular). I then use `async.each` to repeat the asynchronous `doThing` for all items before calling a final completion callback.

**Example**

Imagine we have a list of numbers that we want to submit to a server, one by one. We'll simulate the server submit function by simply having a function that waits 50ms (as if it was making an HTTP request).

```javascript
var submitNumber = function(number, callback) {
  setTimeout(function() {
    console.log('submitted ' + number);
    callback();
  }, 50);
};
```

Calling our submit function for a single number is pretty easy:

```javascript
submitNumber(1, function() {
  console.log('complete');
});

// -> submitted 1
// -> complete
```

But what we need is a function that submits all of them, and notifies us when all have been submitted. Applying the pattern, we create a `submitNumbers` function containing an inner `submitNumber` function, and allow [async.js](https://github.com/caolan/async) to do the hard work for us:

```javascript
var submitNumbers = function(numbers, callback) {
  var submitNumber = function(number, callback) {
    setTimeout(function() {
      console.log('submitted ' + number);
      callback();
    }, 50);
  };

  async.each(numbers, submitNumber, callback);
};
```

Submitting all numbers is now as easy as:

```javascript
var numbers = [1, 2, 3, 4, 5];

submitNumbers(numbers, function() {
  console.log('complete');
});

// -> submitted 1
// -> submitted 2
// -> submitted 3
// -> submitted 4
// -> submitted 5
// -> complete
```