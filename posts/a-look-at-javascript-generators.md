tags: generators async harmony javascript
title: a look at javascript generators
preview: While lots of the new features in ECMAScript 6 are notable improvements to the language, generators are probably the most exciting.
date: July 10 2014 10:30
---
In the upcoming version of JavaScript (ECMAScript 6), the language will get support for modules, observables, classes, arrow functions and quite a long list of other features.

While lots of the new features in ECMAScript 6 are notable improvements to the language, generators are probably the most exciting.

A generator is a function whose execution can yield (welcome, `yield` keyword) at any point, and then later have its execution resumed (via its iterator) from the point it yielded from.

A quick example:

```javascript
var generator = function*() {
  yield 1;
  yield 2;
  yield 3;
};

var iterator = generator();
```

There are a few things to note here.

First, the `function*` syntax marks this function as a *generator function*, allowing the use of the `yield` keyword in its body.

Second, the `yield` keyword causes the generator to produce a value and stop execution. Remember, execution can later be resumed from the point it last stopped at.

Third, calling the generator function does not execute the function body. Rather, it returns a generator-iterator object (here stored in `iterator`) which controls the execution of the body.

Let's see how that works:

```javascript
iterator.next(); // { value: 1, done: false }
iterator.next(); // { value: 2, done: false }
iterator.next(); // { value: 3, done: false }
iterator.next(); // { value: undefined, done: true }
```

As you can see, the generator is being progressed through its `yield` statements each time we call `next()` on the iterator. The iterator's `next()` function returns an object that tells us the yielded `value` and whether the generator is `done`.

The reason this is exciting is because what you're seeing here is a new type of JavaScript flow control. While avoiding the pyramid of callback doom, we have statements being executed linearly with execution yielding somewhere else in-between.

Taking this further, it feels like we could yield an async function (replacing the need to nest callbacks) if we had two things:

* The ability to receive a value back from each completed async function.
* Something controlling our iterator which progresses it only after each async operation finishes.

The first problem is easy to solve – when you pass a value to the iterator's `next()` function, it becomes the result of the resuming `yield` statement:

```javascript
var generator = function*() {
  var result1 = yield 1;
  var result2 = yield 2;
  var result3 = yield 3;

  console.log(result1, result2, result3);
};

var iterator = generator();

iterator.next();    // { value: 1, done: false }
iterator.next('a'); // { value: 2, done: false }
iterator.next('b'); // { value: 3, done: false }
iterator.next('c'); // { value: undefined, done: true }
```

The first call to `next()` begins the generator and hits the first `yield` statement. The second call to `next('a')` resumes the generator and causes the resuming `yield` statement (and consequently now `result1`) to evaluate to `'a'`, and so on for `'b'` and `'c'`.

On the final `next()` call, the iterator completes and `a b c` is output.

OK, so we can control what a `yield` returns, but how can we yield async functions and ensure the iterator is only progressed once those async calls finish?

We could try something like:

```javascript
var fs = require('fs');

var generator = function*() {
  var data = yield fs.readFile('path/to/file', 'utf8', ...);
};
```

The problem is, what do we pass in place of `...`? `fs.readFile` is expecting a callback of the form `function(err, data)` here, but we're trying to avoid nesting callbacks.

What we need is a `fs.readFile` thunk. A thunk is a partially applied version of an async function, leaving just the callback argument unapplied. A thunk allows an async function to be invoked in two parts, first with the regular set of arguments (minus the callback) and finally with just the callback.

To demonstrate, here's a thunk for the `fs.readFile` function in Node:

```javascript
var fs = require('fs');

var readFileThunk = function(path, encoding) {
  return function(callback) {
    return fs.readFile(path, encoding, callback);
  };
};
```

While you'd normally call `fs.readFile` like this:

```javascript
fs.readFile('path/to/file', 'utf8', function(err, data) {

});
```

With a thunk, it can now be done in two parts:

```javascript
readFileThunk('path/to/file', 'utf8')(function(err, data) {

});
```

While this appears useless by itself, in the context of generators it's really useful. With a thunk, we can yield the first part of an async function, leaving the final `function(callback)` part to become the yielded value of the generator.

To demonstrate:

```javascript
var readFiles = function*() {
  var file1 = yield readFileThunk('path/to/file1', 'utf8');
  var file2 = yield readFileThunk('path/to/file2', 'utf8');
  var file3 = yield readFileThunk('path/to/file3', 'utf8');
};

var iterator = readFiles();

iterator.next(); // { value: [Function], done: false }
iterator.next(); // { value: [Function], done: false }
iterator.next(); // { value: [Function], done: false }
iterator.next(); // { value: undefined, done: true }
```

Notice how the yielded values are now all functions? They're all partially applied and just one step away from being invoked, but who's going to invoke them?

We now need a runner function that knows how to take a generator, create a generator-iterator and then iterate until completion. It can assume that each yielded value is a thunk function (as above). All it needs to do is to ensure the generator is progressed as each async function completes, passing results back into the generator through `next()`, as we saw earlier.

Sounds complex, but it's not:

```javascript
var run = function(generator, callback) {
  var iterator = generator();

  var next = function(err, result) {
    if (err) {
      return callback(err);
    }

    var response = iterator.next(result);

    if (response.done) {
      return callback(null, response.value);
    }

    try {
      return response.value(next);
    } catch (err) {
      return callback(err);
    }
  };

  next();
};
```

Let's work through `run` to see how it works.

The first thing it does is to create a generator-iterator (named `iterator` here) for the generator passed as the first argument. `callback` will be called when we're done iterating through the generator.

We then create an internal `next` function which handles the details of iterating through the generator and waiting for each thunk to complete. Our `next` function calls the `next` function of the iterator, passing along the result from the last invocation.

When the generator is `done`, the `callback` is called with the last result from the generator. Otherwise, we invoke the thunk function (the yielded value from the generator) and tell it to call `next` again once the thunk completes. The cycle continues until the generator is complete, or an error occurs.

And now we can do this:

```javascript
var readFiles = function*() {
  var file1 = yield readFileThunk('/path/to/file1', 'utf8');
  var file2 = yield readFileThunk('/path/to/file2', 'utf8');
  var file3 = yield readFileThunk('/path/to/file3', 'utf8');

  return [file1, file2, file3];
};

run(readFiles, function(err, data) {

});
```

Thanks to generators, we're able to write async code in a sync style, while it remains async in the guts of the `run` function.

Let's take this even further. Rather than `run` immediately executing the generator, it could return a thunk too:

```javascript
var run = function(generator) {
  return function(callback) {
    var iterator = generator();

    var next = function(err, result) {
      if (err) {
        return callback && callback(err);
      }

      var response = iterator.next(result);

      if (response.done) {
        return callback && callback(null, response.value);
      }

      try {
        return response.value(next);
      } catch (err) {
        return callback && callback(err);
      }
    };

    next();
  };
};
```

Because we now get a thunk back from `run`, we can compose generators together really easily:

```javascript
var readFiles = function*() {
  return {
    file1: yield readFileThunk('/path/to/file1', 'utf8'),
    file2: yield readFileThunk('/path/to/file2', 'utf8'),
    file3: yield readFileThunk('/path/to/file3', 'utf8')
  };
};

run(function*() {
  var data = {
    files1: yield run(readFiles),
    files2: yield run(readFiles),
    files3: yield run(readFiles)
  };
})();
```

So by wrapping traditional node-style callbacks in thunks (allowing them to be executed in two stages) we can yield them from generators and run those generators with functions like our simple `run` above. We can achieve a very synchronous-looking style, while remaining truly asynchronous.

I'm sure it won't surprise you to find that the prolific [TJ Holowaychuk](https://github.com/visionmedia) (as well as many others) have already created some excellent libraries to enable us to start using generators for flow control. I'll quickly show you [Co](https://github.com/visionmedia/co), but also check out [suspend](https://github.com/jmar777/suspend).

Let's go right back to the beginning. Here's a pointlessly async function that adds two numbers:

```javascript
var delayedAdd = function(number1, number2, callback) {
  setTimeout(function() {
    return callback(null, number1 + number2);
  }, 1000);
};
```

Like the `run` example above, Co works with thunks (as well as promises, and some other things), so let's create a thunk for `delayedAdd`. Now that you know how thunks work, we'll also make it a bit easier by using the [thunkify](https://github.com/visionmedia/node-thunkify) library. By the way, TJ made that too.

```javascript
var thunkify = require('thunkify');

var delayedAdd = function(number1, number2, callback) {
  setTimeout(function() {
    return callback(null, number1 + number2);
  }, 1000);
};

var delayedAddThunk = thunkify(delayedAdd);
```

Now we have a thunk, we can use Co just like we used `run`. Note how Co also returns a thunk, just like we did with `run`:

```javascript
var co = require('co');
var thunkify = require('thunkify');

var delayedAdd = function(number1, number2, callback) {
  setTimeout(function() {
    return callback(null, number1 + number2);
  }, 1000);
};

var delayedAddThunk = thunkify(delayedAdd);

co(function*() {
  var total1 = yield delayedAddThunk(1, 2);
  var total2 = yield delayedAddThunk(3, 4);
  var total3 = yield delayedAddThunk(5, 6);

  console.log(total1, total2, total3);
})();
```

And as you'd expect, the example above outputs `3 7 11` after a 3 second delay.

Generators may play a big part in the style of future JavaScript code. Being able to write code in a more synchronous style makes it much more readable, and who doesn't want to see the end of callback hell? It'll certainly be interesting to see how patterns emerge around generators when ES6 is fully adopted by the major browsers and node.

In the meantime, you can play with generators by using node 0.11 and running it with the `--harmony` flag.

If you're sold on generators and want to start using them more practically, check out [Koa](https://github.com/koajs/koa). Koa is a new, lightweight web framework that uses generators (with Co) exclusively to let you build web apps without callbacks.