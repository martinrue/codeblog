tags: swift objective-c mix-and-match
title: swift and objective-c, sitting in a tree
preview: So, if you haven't heard already, Swift (Apple's new programming language) was released yesterday.
date: June 3 2014 10:00
---
So, if you haven't heard already, Swift (Apple's new programming language) was released yesterday. I'm really liking it so far and it already feels much cleaner than Objective-C to write.

One of my (and many others') first question was: how does it interop with Objective-C? Fortunately there's a nice solution using something Apple calls [Mix and Match](https://developer.apple.com/library/prerelease/ios/documentation/Swift/Conceptual/BuildingCocoaApps/MixandMatch.html#//apple_ref/doc/uid/TP40014216-CH10-XID_76).

If you create a new iOS/OS X application and select 'Swift' as the language, you'll end up with something like this:

![initial project structure](/img/post-images/mix-and-match/1.png)

It's immediately apparent that Swift projects are going to contain fewer files since classes no longer need header files like they did in Objective-C. Swift is just neater in syntax too, with the default view controller looking quite clean:

```go
import UIKit

class ViewController: UIViewController {
  override func viewDidLoad() {
    super.viewDidLoad()
  }
}
```

There'll be lots of people (myself included) who have a serious investment in existing Objective-C code. From custom model code, utilities to third-party libraries, there's certainly a need to consume Objective-C code from within Swift code for now.

Let's say we had a `Person` class:

```obj-c
#import <Foundation/Foundation.h>

@interface Person : NSObject

@property (nonatomic, strong) NSString *first;
@property (nonatomic, strong) NSString *last;

- (NSString *)getFullName;

@end
```

And the following implementation:

```obj-c
#import "Person.h"

@implementation Person

- (NSString *)getFullName {
  return [NSString stringWithFormat:@"%@ %@", self.first, self.last];
}

@end
```

Let's imagine that the `Person` class was complex, valuable and we didn't want to simply rewrite it in Swift (which would in this case be trivial, and roughly 1000% smaller). How would we use `Person` from Swift code?

Easy. Simply add the respective `.m` and `.h` files to the project and you're presented with the following dialog:

![initial project structure](/img/post-images/mix-and-match/2.png)

Select 'Yes' and Xcode will generate an "Objective-C bridging header" file. You should now see an additional header in the project list:

![initial project structure](/img/post-images/mix-and-match/3.png)

Simply add an Objective-C style `#import` for each public interface from your Objective-C code that you want to be bridged across to Swift. In this case, assuming you named the `Person` header file `Person.h`, your bridging header should look like this:

```obj-c
#import "Person.h"
```

That's all it takes.

`Person` is now available to Swift code as though it was a Swift class itself. To test, let's instantiate a `Person`, set the first and last name and then call the `getFullName` method.

Here's the updated `ViewController.swift`.

```go
import UIKit

class ViewController: UIViewController {
  override func viewDidLoad() {
    super.viewDidLoad()

    let darthy = Person()
    darthy.first = "Darth"
    darthy.last = "Vader"

    println(darthy.getFullName())
  }
}
```

And of course, the console displays:

```no-highlight
Darth Vader
```

The same approach can be used for any Objective-C code – just throw an `#import` into the bridging header and start using the class in your Swift code.

Easy.