tags: swift singleton patterns
title: the singleton pattern in swift
preview: So I was trying to create a singleton in Swift (Yeah, I know – I was going straight to hell anyway).
date: June 5 2014 23:30
---
So I was trying to create a singleton in Swift (Yeah, I know – I was going straight to hell anyway). My first attempt was to create a class with a static/class-level getter which lazily creates the instance. That'd work, right?

```go
class Singleton {
  class var instance: Singleton?

  class func sharedInstance() -> Singleton {
    if !instance {
      instance = Singleton()
    }

    return instance!
  }
}
```

Well, not quite.

Swift doesn't yet support class-level `var`, so we can't keep the instance there. One option is to move the instance into global scope, outside of the class:

```go
var instance: Singleton?

class Singleton {
  class func sharedInstance() -> Singleton {
    if !instance {
      instance = Singleton()
    }

    return instance!
  }
}
```

This works, but we have a global. We'd need to make sure we don't accidentally create another singleton and name its global instance variable the same (the Swift compiler would catch this, but it's still bad enough to get you killed).

So what now?

It turns out that Swift actually does have "type properties", which are properties that belong to a type rather than an instance. There are two kinds of type property: stored and computed.

Stored type properties are just regular properties that hold a value, but at the type level. Computed properties don't store a value and act more like a type-level getter, computing a value each time they're accessed.

The catch: a class is a reference type and cannot have stored type properties. Only value types such as `enum` and `struct` can declare stored type properties (with the `static` keyword).

However, classes can have computed type properties:

```go
class Singleton {
  class var sharedInstance: Singleton {
    // return the single instance
  }
}
```

Of course, this hasn't really solved anything since the computed type property `sharedInstance` will be evaluated each time. We still don't have any static storage for the instance.

The trick is to combine the two.

We can have the computed type property `sharedInstance` lazily create the instance, but store the instance in a stored type property. As mentioned earlier, stored type properties can only be used with value types (`enum` and `struct`), so the solution is:

```go
class Singleton {
  struct Static {
    static var instance: Singleton?
  }

  class var sharedInstance: Singleton {
    if !Static.instance {
      Static.instance = Singleton()
    }

    return Static.instance!
  }
}
```

And now we can access the singleton instance with `Singleton.sharedInstance`.

The next problem is that we can also access `Singleton.Static.instance`. While we could ignore this problem, it'd be nicer to know that people can't accidentally or intentionally screw with the singleton instance.

To fix this, we can move the `struct` into the computed property. It will still have type-level storage, but be hidden from outside access:

```go
class Singleton {
  class var sharedInstance: Singleton {
    struct Static {
      static var instance: Singleton?
    }

    if !Static.instance {
      Static.instance = Singleton()
    }

    return Static.instance!
  }
}
```

Looking good. Well, assuming we don't need thread safety.

Since we check if `Static.instance` is falsy before we assign a new instance to it, this code isn't thread safe – execution could be interrupted between these two statements.

If you've created a singleton in Objective-C before, you'll be familiar with `dispatch_once`. Apple recommends using `dispatch_once` to ensure an operation happens only once between threads.

To make the singleton implementation thread safe, we need to wrap the instance assignment in a call to `dispatch_once`, like so:

```go
class Singleton {
  class var sharedInstance: Singleton {
    struct Static {
      static var instance: Singleton?
      static var token: dispatch_once_t = 0
    }

    dispatch_once(&Static.token) {
      Static.instance = Singleton()
    }

    return Static.instance!
  }
}
```

And there it is. A thread safe singleton in Swift.