# code blog
A quick and easy way to host your own code blog.

![](https://github.com/martinrue/codeblog/raw/master/public/img/screenshot.png)

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

## Running
...

### Deploying
...
