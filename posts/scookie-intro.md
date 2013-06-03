title: scookie – user login via cookies
date: June 3 2013 22:40
---

User sessions are pretty common in most web apps. Normally, a session is created on the server for the logged-in user and a session ID is passed back to the client so that it can continue to idenity its own session on subsequent requests.

But then you have a centralised session which starts to get complex when you think about multiple web servers. It can be much simpler by just giving a cookie to the client. Then we have no lingering state on the server and the client tells you what you need to know on each request. 

Of course, the cookie data needs to be secured so it can't be modified – that way you're just giving the user some data during login and having them hand it back to you each time, with no risk that it has been tampered with.

So I made [scookie](https://github.com/martinrue/scookie) which does exactly this.

```no-highlight
npm install scookie
```

The first thing you need to do is call `init` to specify details such as the cookie name and hash key:

```javascript
var scookie = require('scookie');

scookie.init({
  name: 'myapp',
  secret: 's9dlk72vmnkj32',
  unauthorisedUrl: '/',
  age: 24 * 60 * 60 * 1000
});
```

When a user logs in, we'll issue a cookie named `myapp`, secured by HMAC with the key `s9dlk72vmnkj32`. It'll last for `24` hours, and if we use the scookie middleware (`scookie.middleware.mustBeLoggedIn`), it'll redirect unauthorised users to the root of the app.

And now it's as simple as:

```javascript
app.get('/login', function(req, res) {
  scookie.login({ username: 'martin' }, res);
  res.redirect('/account');
});

app.get('/account', scookie.middleware.mustBeLoggedIn, function(req, res) {
  var cookie = scookie.getCookie(req);
  res.send('account for: ' + cookie.username);
});
```

The cookie data is protected by an HMAC-signed hash, so any modifications to the data will be rejected. And that's it – just simple session management via cookies.
