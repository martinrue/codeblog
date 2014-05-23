var fs = require('fs');
var path = require('path');
var glob = require('glob');
var marked = require('marked');
var moment = require('moment');
var _ = require('lodash');

var blogs = [];

marked.setOptions({ langPrefix: '' });

var _getMeta = function(data) {
  var getText = function(regex) {
    var match = data.match(regex);
    return match ? match[1].trim() : '';
  };

  var getValues = function(regex) {
    var match = data.match(regex);
    return match ? match[1].trim().split(' ') : [];
  };

  return {
    preview: getText(/preview:(.*)/),
    title: getText(/title:(.*)/),
    tags: getValues(/tags:(.*)/),
    date: getText(/date:(.*)/)
  };
};

var _reinit = function() {
  if (process.env.NODE_ENV !== 'production') {
    blogs = [];
    init();
  }
};

var init = function() {
  var files = glob.sync(__dirname + '/../posts/*.md');
  _.each(files, function(file) {
    if (file.match(/readme.md/)) return;

    var sections = fs.readFileSync(file, 'utf8').split('---');
    var meta = _getMeta(sections[0]);
    var post = marked(sections[1]);

    blogs.push({
      post: post,
      tags: meta.tags,
      title: meta.title,
      preview: marked(meta.preview),
      url: path.basename(file, '.md'),
      date: new Date(meta.date),
      relativeDate: function() { return moment(new Date(meta.date)).from(new Date); }
    });
  });

  blogs = _.sortBy(blogs, function(blog) { return blog.date; }).reverse();
};

var find = function(url) {
  _reinit();
  return url ? _.findWhere(blogs, { url: url }) : blogs;
};

var findByTag = function(tag) {
  _reinit();
  return _.where(blogs, { tags: [tag] });
};

module.exports = {
  init: init,
  find: find,
  findByTag: findByTag
};

init();
