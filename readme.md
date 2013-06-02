# code blog
A quick and easy way to host your own code blog.

![](https://github.com/martinrue/codeblog/raw/master/public/img/screenshot.png)

## How
Simply create `your-blog-post.md` files in the `/posts` directory and you're done. GitHub flavoured markdown is supported and code blocks are automatically highlighted.

## Config
Before deploying your own copy, please change the options in the [config.js](https://github.com/martinrue/codeblog/blob/master/config.js):

```javascript
module.exports = {
  email: 'hello@martinrue.com', // used to generate the blog image
  title: 'Blog Title Here',     // the page title and the blog header text
  style: 'monokai'              // the syntax highlighting theme to use
};
```

### Supported Styles
You can set the `style` config to any of the following values: `arta.css`, `ascetic.css`, `brown_paper.css`, `dark.css`, `default.css`, `far.css`, `github.css`, `googlecode.css`, `idea.css`, `ir_black.css`, `magula.css`, `monokai.css`, `pojoaque.css`, `rainbow.css`, `school_book.css`, `solarized_dark.css`, `solarized_light.css`, `sunburst.css`, `tomorrow-night-blue.css`, `tomorrow-night-bright.css`, `tomorrow-night-eighties.css`, `tomorrow-night.css`, `tomorrow.css`, `vs.css`, `xcode.css`, `zenburn.css`.

## Syntax Highlighting
To highlight a block of code, surround the code with three backticks and a language specifier:

```
```javascript
console.log('Hello World');
```
```

If you want to force the code block to have no highlighting, use the language specifier `no-highlight`.

## Running
...

### Deploying
...
