var config = require('../config');
var blogs = require('../lib/blogs');

var routes = function(app) {
  app.get('/', function(req, res) {
    var all = blogs.find();

    if (all.length === 0) {
      return res.render('help', { config: config });
    }

    res.render('index', { blogs: all, config: config });
  });

  app.get('/posts/:url', function(req, res, next) {
    var blog = blogs.find(req.param('url'));

    if (!blog) {
      return next();
    }

    res.render('index', { blogs: [blog], config: config });
  });
};

module.exports = routes;
