tags: ifelse javascript
title: lookup tables
preview: Tired of a messy if/else or switch block? Use a lookup table.
date: January 16 2014 12:55
---
Quite often I end up in a situation where I need to do something based on the value of something else. My current example is an `action` variable that may contain `create`, `update` or `remove`.

The most common way to deal with this is simply an `if/else` construct:

```javascript
if (action === 'create') {
  // create
} else if (action === 'update') {
  // update
} else {
  // remove
}
```

While that works just fine, it feels kind of crappy for a few reasons.

First, the else is a *catch all* which would run irrespective of what `action` was.

Seondly, I know I'm going to have to keep adding more `else if...` every time a new option is introduced.

Thirdly, the code that runs as part of action is kind of loosely defined – it's just the body of an `if` condition. Bonus reason: `if` blocks don't have scope in JS, so a function-oriented solution here would be much nicer.

As an alternative, lookup tables are perfect for this. Let's write the code to use a lookup table instead:

```javascript
var actions = {
  create: function() {
    // create
  },
  update: function() {
    // update
  },
  remove: function() {
    // remove
  }
};

var fn = actions[action];
fn && fn();
```

This feels much better. The set of actions stand alone and are decoupled from the logic to select one. Additionally, each action now has its own scope and feels much more explicit.

If I introduce 2 or 3 new types of `action`, extending this code will be easier than tacking on extra `if/else` statements to an already large block of code.

Or maybe I decide to create a new `multiple` variable holding `['create', 'print', ...]` to specify multiple actions. Because the selection of action and the definition of it are separate, handling this case is much easier with a lookup table, avoiding things like:

```javascript
if (multiple[0] === 'create' && multiple[1] === 'print') {

} else if (multiple[0] === 'create' && multiple[1] === 'email') {

}
```

And instead:

```javascript
multiple.forEach(function(type) {
  var fn = actions[type];
  fn && fn();
});
```

Lookup tables aren't a solution for every problem of course, but they're a pretty nice alternative (with their own benefits) if you need to drop that nasty `if/else` or `switch` block.