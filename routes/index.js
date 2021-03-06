var config = require('../config');
var blogs = require('../lib/blogs');
var _ = require('lodash');

var routes = function(app) {
  app.get('/', function(req, res) {
    var all = blogs.find();

    if (all.length === 0) {
      return res.render('help', { config: config });
    }

    res.render('all', { blogs: all, config: config });
  });

  app.get('/tag/:tag', function(req, res, next){
    var tagged = blogs.findByTag(req.param('tag'))

    if (tagged.length === 0) {
      return res.render('help', { config: config });
    }
    res.render('all', { blogs: tagged, config: config });
  });


  app.get('/posts/:url', function(req, res, next) {
    var blog = blogs.find(req.param('url'));

    if (!blog) {
      return next();
    }

    res.render('post', { blog: blog, config: config });
  });
};

module.exports = routes;
