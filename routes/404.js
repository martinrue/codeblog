var config = require('../config');

var routes = function(app) {
  app.get('*', function(req, res) {
    res.statusCode = 404;
    res.render('404', { config: config });
  });
};

module.exports = routes;
