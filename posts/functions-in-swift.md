tags: swift functions closures
title: functions and closures in swift
preview: Spending a lot of time with JavaScript, I've come to rely on the convenience of being able to pass functions around and compose them more freely.
date: June 5 2014 12:30
---
When Apple announced Swift a few days ago, I was very pleased to hear that it supports first-class functions.

Spending a lot of time with JavaScript, I've come to rely on the convenience of being able to pass functions around and compose them more freely than when they're bound to a structure such as a class (Swift also supports classes too, by the way).

In their simplest form, functions in Swift are pretty straightforward:

```go
func someFunction() {

}
```

When a function has parameters, the name precedes the type and the parameter list sits inside the parens (separated by commas):

```go
func someFunction(age: Int, name: String) {

}
```

And when it returns something, the return type is denoted by `-> {type}` following the parens:

```go
func someFunction(age: Int, name: String) -> String {
  return "string"
}
```

The type of a function can be described using the `({type}, {type}, ...) -> {type}` syntax. To declare a function that can receive another function as an argument, we'd do something like this:

```go
func callFunction(fn: (Int, String) -> String) {
  var result = fn(42, "Darth")
}
```

Here, `callFunction` has one parameter named `fn` which expects a function of type `(Int, String) ->  String` to be passed. To call `callFunction`, we simply pass it the name of a function that has the correct type:

```go
func callFunction(fn: (Int, String) -> String) {
  var result = fn(42, "Darth")
  // "age: 42 name: Darth"
}

func combine(age: Int, name: String) -> String {
  return "age: \(age) name: \(name)"
}

callFunction(combine)
```

Going further, if we want an "anonymous function" – that is, an unnamed function declared in-place – we can make use of Swift's closures.

Closures are like blocks in Objective-C (or lambdas in other languages). They are self contained bits of code, just like functions, that can capture (close over) things in their lexical scope.

Simply: they make it nice and easy to create functions on-the-fly. Closures have the following syntax:

```no-highlight
{ (parameters) -> return-type in
  statements
}
```

Written as a closure, the `combine` function above looks like this:

```go
{ (age: Int, name: String) -> String in
  return "age: \(age) name: \(name)"
}
```

The type of which is `(Int, String) -> String` – just like the original function. To store the closure, put it into `var` as normal:

```go
var fn: (Int, String) -> String = { (age: Int, name: String) -> String in
  return "age: \(age) name: \(name)"
}
```

That's a little redundant of course (since we can see the type being repeated on the LHS and the RHS), and luckily Swift thinks so to. If we remove the type annotation from the variable declaration, Swift will infer it from the RHS.

```go
var closure = { (age: Int, name: String) -> String in
  return "age: \(age) name: \(name)"
}
```

Although you can store closures like this, I expect it'll be more common to see closures being passed as inline arguments (like we see in JavaScript):

```go
func callFunction(fn: (Int, String) -> String) {
  var result = fn(42, "Darth")
  // "age: 42 name: Darth"
}

callFunction {
  age, name in
  "age: \(age) name: \(name)"
}
```

There's a few things to notice here.

Firstly, the parens around the call to `callFunction` have gone, making the call look much more Ruby-esque.

Secondly, we're using Swift's type inference again for the `age` and `name` parameters of the closure – they can be inferred since they're specified in the declaration of `callFunction`. Same goes for the return type of the closure (no `-> String` before the `in`).

Lastly, there's no `return` keyword – Swift knows it's the return value because it's the last statement within the closure.

You can take this even further when you consider that Swift has a nice implementation of generics. For example, perhaps we want a more functional style of iteration with something like `each`. A possible implementation of `each` might be:

```go
func each(items: Array<Int>, fn: Int -> ()) {
  for item in items {
    fn(item)
  }
}

each([1, 2, 3]) {
  number in
  println(number)
}
```

But the `Array` parameter is typed to `Int` and the `fn` parameter is typed to `Int -> ()`, meaning our `each` function won't work with an array of `String`, or anything else.

To solve this, we can make the type generic in a very C#-esque way:

```go
func each<T>(items: Array<T>, fn: T -> ()) {
  for item in items {
    fn(item)
  }
}

each([1, 2, 3]) {
  number in
  println(number)
}

each(["one", "two", "three"]) {
  number in
  println(number)
}
```

And now `each` can be invoked with any type of `Array`. Also notice that the type isn't specified in the call to `each` – it's inferred from the argument type.

In addition to the things shown here, you can do even more with Swift's closures. Take a look at the [Swift docs](https://developer.apple.com/library/prerelease/ios/documentation/Swift/Conceptual/Swift_Programming_Language/Closures.html#//apple_ref/doc/uid/TP40014097-CH11-XID_117) for more.
