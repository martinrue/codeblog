var http = require('http');
var express = require('express');
var mustachex = require('mustachex');

var app = express();

app.configure(function() {
  app.engine('html', mustachex.express);
  app.set('view engine', 'html');
  app.set('views', __dirname + '/views');
  app.set('layout', true);
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
});

app.configure('development', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function() {
  app.use(express.errorHandler());
});

require('./routes/index')(app);
require('./routes/404')(app);

http.createServer(app).listen(process.env.PORT || 9111);

