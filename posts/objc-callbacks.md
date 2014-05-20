tags: objective-c callbacks protocols
title: callbacks in objective-c
preview: I've been working with Objective-C recently and it's been fun trying to figure out what kind of structure I'd like my code to have based on how I'd have done the same thing in JavaScript.
date: May 19 2014 21:00
---
I've been working with Objective-C recently and it's been fun trying to figure out what kind of structure I'd like my code to have based on how I'd have done the same thing in JavaScript.

The example here is a login screen. The behaviour is hidden away inside a `LoginService`, but the `LoginViewController` needs to invoke it and somehow be told once it completes.

In JavaScript, you'd do something like this:

```javascript
loginService.login(function(err, session) {
  if (err) {
    // login failed
  }

  // login succeeded and we have a session
});
```

It's pretty common in JavaScript to have this single callback with the `(err, ...)` style, handling both error and success cases. It could, of course, be designed to take two functions for each case, a bit like how jQuery `ajax` et al work:

```javascript
var loginSucceeded = function(session) {
  // login succeeded and we have a session
};

var loginFailed = function(err) {
  // login failed
};

loginService.login(loginSucceeded, loginFailed);
```

Back to Objective-C. It being quite different to JavaScript, there's a couple of different options. We can use a feature called blocks to create a very similar structure to JavaScript-style callbacks. A block is a lexically-scoped closure for Obj-C (and C/C++). For all intents and purposes, it's just like the first class functions we have in JavaScript.

Following from the JavaScript examples above, we could have a login function accept a single block:

```objectivec
+ (void)login:(void(^)(int error, SessionData *session))completeHandler {
  // perform login logic
  // completeHandler(error, session) is invoked to 'call back'
}
```

If you just had to go and change your underwear, you're not alone: [fuckingblocksyntax.com](http://fuckingblocksyntax.com). It's not as bad as it looks really. We're just declaring a block `(^)` that has a `void` return type, and has two parameters `(int error, SessionData *session)`.

If your underwear is doing OK, here's what the login signature looks like when we use two separate blocks for the success and error cases:

```objectivec
+ (void)login:(void(^)(SessionData *session))successHandler errorHandler:(void(^)(int error))errorHandler {
  // perform login logic
  // successHandler(session) is invoked to 'call back' in the success case
  // errorHandler(error) is invoked to 'call back' in the error case
}
```

We're really having a syntax party now. With Obj-C basically being C, we could `#define` those ugly block declarations away to make the code a bit more readable:

```objectivec
#define SuccessHandler void(^)(SessionData *session)
#define ErrorHandler   void(^)(int error)

+ (void)login:(SuccessHandler)successHandler errorHandler:(ErrorHandler)errorHandler {
  // perform login logic
  // successHandler(session) is invoked to 'call back' in the success case
  // errorHandler(error) is invoked to 'call back' in the error case
}
```

So that's the block version – pretty similar to using callbacks in JavaScript, but with enough extra syntax to make you need a syntax doctor.

Another solution would be to use a delegate object, which in this case could be the 'LoginViewController' itself. In other words, the `LoginService#login` method could receive an object that conforms to a certain protocol and `login` can then safely call the methods of the conforming object to let it know once login succeeds or fails.

The first thing we need is a protocol (basically the same as an interface in C#/Java):

```objectivec
@protocol LoginDelegate
- (void)loginSucceeded:(SessionData *)session;
- (void)loginFailed:(int)error;
@end
```

Now we can make the controller conform to this protocol and become a valid delegate object for anyone who needs a `LoginDelegate`:

```objectivec
@interface LoginViewController : UIViewController<LoginDelegate>

@end
```

Because this is an iOS view controller, the class inherits from `UIViewController`. Since we want it to act as a delegate for the login process, it signifies that it conforms to the `LoginDelegate` protocol that we created above. Next, we need to make sure it does conform by adding the methods specified by the protocol to the implementation of `LoginViewController`:

```objectivec
@implementation LoginViewController

- (void)loginSucceeded:(NSString *)session {
  // login succeeded and we have a session
}

- (void)loginFailed:(int)error {
  // login failed and we have an error
}

@end
```

Of course, the `LoginService#login` method needs to be changed too. It's no longer going to receive blocks, it'll be receiving a delegate object for the `LoginDelegate` protocol:

```objectivec
+ (void)login:(id<LoginDelegate>)delegate {
  // perform login logic
  // [delegate loginSucceeded:session] is invoked to 'call back' in the success case
  // [delegate loginFailed:error] is invoked to 'call back' in the error case
}
```

Now all that remains is for the `LoginViewController` to kick off the login process and pass itself as a delegate object to `LoginService#login`:

```objectivec
@implementation LoginViewController

- (void)startLogin {
  [LoginService login:self];
}

- (void)loginSucceeded:(NSString *)session {
  // login succeeded and we have a session
}

- (void)loginFailed:(int)error {
  // login failed and we have an error
}

@end
```

So there it is – two ways of achieving a callback style in Objective-C.

The block version is definitely less involved since it's more implicit – as long as the correct type of blocks are passed into the call, it's all good. The delegate approach is more explicit by relying on a protocol to make sure the delegate object conforms to the expectations of the caller.
