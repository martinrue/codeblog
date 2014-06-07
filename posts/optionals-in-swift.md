tags: swift optional-values
title: swift's optional values
preview: The `?` is Swift's way of saying that a variable/constant is optional. An optional is how you specify that a variable might not have a value.
date: June 7 2014 13:55
---
In Swift code, you'll see a lot of `String?`, `Int?` and such things. What's this `?` all about?

The `?` is Swift's way of saying that a variable/constant is optional. An optional is how you specify that a variable might not have a value. Unlike Objective-C (and quite a few other languages), variables in Swift must have values unless they are optional.

For example:

```go
var name: String = nil
```

Will cause the compiler to refer you to a psychiatrist. `name` is not an optional string (`String?`), so what the hell are you doing trying to put `nil` into it, you crazy freak.

Placing the optional `?` after the type clears things up and makes the Swift compiler your BFF again:

```go
var name: String? = nil
```

It just so happens `nil` is the default value for uninitialised optionals, so we can drop that bit:

```go
var name: String?
```

So how do you check if an optional actually has a value?

```go
var name: String?

if name {
  let message = "Hello " + name!
  println(message)
}
```

If an optional doesn't have a value, it will evaluate to a falsy value. In this example, the body of the `if` is not executed because `name` doesn't have a value.

You may also be wondering why there's a `!` at the end of `name`. This is how you unwrap an optional value (to retrieve its actual value) once you're sure it does in fact contain one.

Swift makes patterns like this a bit easier with something called optional binding:

```go
var name: String?

name = "Darth"

if let unwrappedName = name {
  let message = "Hello " + unwrappedName
  println(message)
}
```

Notice the `if let <identifier> = <optional> { ...` syntax. Two things happen here. First, the Swift compiler will check if the optional has a value, unwrapping and assigning it to the constant if it does. Second, if the optional had a value, it will execute the body of the `if`.

If the optional does not have a value, nothing happens.

This raises the question of how interop with Objective-C works, given that an Objective-C object can be `nil`. Well, Swift also has the concept of implicitly unwrapped optionals, which are denoted by placing a `!` after the type instead of a `?`:

```go
var name: String!

name = "Darth"

if name {
  let message = "Hello " + name
  println(message)
}
```

An implicitly unwrapped optional works the same way as a regular optional, except you don't need a `!` to unwrap it – it's unwrapped as soon as it's used (meaning it might explode if there's no value).

Objective-C objects in Swift are returned as implicitly unwrapped optionals. You'll still need to check if they have values before using them, but you don't need to explicitly unwrap them by placing a `!` at the end.

Optionals in Swift are a nice way to be more explicit about whether a variable is expected to have a value or not, and avoids a lot of the `null`/`nil` checking you'd have in Objective-C. And since optionals can apply to both value and reference types, the entire approach is more consistent.