# code blog
A quick and easy way to host your own code blog.

<p align="center">
  <img src="https://github.com/martinrue/codeblog/raw/master/public/img/screenshot.png" />
</p>

## How
Simply create `your-blog-post.md` files in the `/posts` directory and you're done. GitHub flavoured markdown is supported and code blocks are automatically highlighted.

### Meta
The first three lines of any post should look like the following:

```
title: Blog Post Title
date: Jan 1 2013
---
```

The markdown body of the post should follow the `---` line.

## Code Highlighting
To highlight a block of code, surround the code with three backticks and a language specifier:

<pre>
```javascript
console.log('Hello World');
```
</pre>

To force the code block to have no highlighting, use the language specifier `no-highlight`.

## Config
Before deploying your own copy, please change the options in the [config.js](https://github.com/martinrue/codeblog/blob/master/config.js) file:

```javascript
module.exports = {
  email: 'hello@martinrue.com', // used to generate the blog image
  title: 'Blog Title Here',     // the page title and the blog header text
  style: 'monokai'              // the syntax highlighting theme to use
};
```

### Supported Styles
You can set the `style` config to any of the following values: `arta` `ascetic` `brown_paper` `dark` `default` `far` `github` `googlecode` `idea` `ir_black` `magula` `monokai` `pojoaque` `rainbow` `school_book` `solarized_dark` `solarized_light` `sunburst` `tomorrow-night-blue` `tomorrow-night-bright` `tomorrow-night-eighties` `tomorrow-night` `tomorrow` `vs` `xcode` `zenburn`.

## Running Locally
Simply clone the repo, install dependencies and run `node codeblog.js`:

```
git clone git@github.com:martinrue/codeblog.git
cd codeblog
npm install
node codeblog.js
```

Now hit `http://localhost:9111` and you should be running your own code blog.

## Deployment
If you want a more permanent home, deploying to [heroku](https://www.heroku.com) is super easy. Make sure you have an account and you have installed the [heroku toolbelt](https://toolbelt.heroku.com), then:

```
git clone git@github.com:martinrue/codeblog.git
cd codeblog
heroku create
git push heroku master
heroku open
```
