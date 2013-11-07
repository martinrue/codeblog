tags: templating mustache javascript
title: express + mustache = mustachex
preview: A nice little library I wrote for using the mustache template engine in express seamlessly.
date: June 2 2013 22:00
---

So I wanted to use [mustache](http://mustache.github.io) in [express](http://expressjs.com) and have it *just work&trade;*. I wanted to use partials without doing anything special. I wanted to do template extension without figuring out how to instead compose partials to achieve the same effect.

As it turns out, mustache doesn't support template extension and everything else seemed to suck, or have horrible code, so I built [mustachex](https://github.com/martinrue/mustachex).

It's really simple:

```javascript
var http = require('http');
var express = require('express');
var mustachex = require('mustachex');

var app = express();

app.configure(function() {
  app.engine('html', mustachex.express);
  app.set('view engine', 'html');
  app.set('views', __dirname + '/views');
});

app.get('/', function(req, res) {
  res.render('index', { layout: true });
});

http.createServer(app).listen(80, done);
```

And that's it – a fully working express application which renders `views/index.html` into the layout file `views/layout.html`.

Using partials is just as easy and there's a couple of extra features to help keep your code simple, such as setting the layout globally and partial subdirectories.

So if you want to use express + mustache:

```no-highlight
npm install mustachex
```
