tags: javascript
title: timing functions
preview: Although premature optimisation is the root of all evil, we sometimes want to make some CPU bound code a bit faster – especially if it sucks like most my code.
date: June 18 2013 21:00
---

Although [premature optimisation is the root of all evil](http://en.wikiquote.org/wiki/Donald_Knuth), we sometimes want to make some CPU bound code a bit faster – especially if it sucks like most my code.

Imagine we had a function like this:

```javascript
var speedUpLoop = function() {
  for (var i = 0; i < 999999999; i++) { }
};
```

If you missed *the speed-up loop* reference, you really ought to [read this](http://thedailywtf.com/Articles/The-Speedup-Loop.aspx).

The simplest way to measure our `speedUpLoop` function is to grab the current time before it runs, and then grab the current time again after it finishes. The difference is the time taken:

```javascript
var start = (new Date).getTime();
speedUpLoop();
var timeTaken = (new Date).getTime() - start;

console.log('time taken: ' + timeTaken + 'ms');
```

And we get:

```no-highlight
time taken: 1397ms
```

Writing this wrapping code is a bit messy though, and it gets even more annoying when we want to time multiple things at the same time.

Fortunately there's an easier way via `console.time`. The `console.time` and `console.timeEnd` functions wrap this timing code internally and support an ID to make it easier to time multiple things at the same time:

```javascript
console.time('speed up loop');
speedUpLoop();
console.timeEnd('speed up loop');
```

When the call is made to `console.timeEnd`, the matching `console.time` is found using the ID and it outputs the time taken:

```no-highlight
speed up loop: 1374.275ms
```

`console.time` is available in the browser and in node.js.
