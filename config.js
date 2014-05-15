var crypto = require('crypto');

module.exports = {
  email: 'me@abr4xas.org',
  title: 'El blog de abr4xas',
  description: 'Descripción',
  twitter: '@username',
  disqus_shortname: 'disqus_shortname'
};

var gravatarHash = crypto.createHash('md5').update(module.exports.email).digest('hex');
module.exports.gravatar = 'http://www.gravatar.com/avatar/' + gravatarHash;
