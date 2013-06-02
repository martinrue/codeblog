var fs = require('fs');
var path = require('path');
var glob = require('glob');
var marked = require('marked');
var moment = require('moment');
var _ = require('underscore');

var blogs = [];

marked.setOptions({ langPrefix: '' });

var _getMeta = function(data) {
  return {
    title: data.match(/title:(.*)/)[1].trim(),
    date: data.match(/date:(.*)/)[1].trim()
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
      title: meta.title,
      url: path.basename(file, '.md'),
      date: new Date(meta.date),
      relativeDate: moment(new Date(meta.date)).from(new Date)
    });
  });

  blogs = _.sortBy(blogs, function(blog) { return blog.date; }).reverse();
};

var find = function(url) {
  _reinit();
  return url ? _.findWhere(blogs, { url: url }) : blogs;
};

module.exports = {
  init: init,
  find: find
};

init();
