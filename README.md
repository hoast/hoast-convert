<div align="center">
  
  [![npm package @latest](https://img.shields.io/npm/v/hoast-convert.svg?label=npm@latest&style=flat-square&maxAge=3600)](https://npmjs.com/package/hoast-convert)
  [![npm package @next](https://img.shields.io/npm/v/hoast-convert/next.svg?label=npm@next&style=flat-square&maxAge=3600)](https://npmjs.com/package/hoast-convert/v/next)
  
  [![Travis-ci status](https://img.shields.io/travis-ci/hoast/hoast-convert.svg?branch=master&label=test%20status&style=flat-square&maxAge=3600)](https://travis-ci.org/hoast/hoast-convert)
  [![CodeCov coverage](https://img.shields.io/codecov/c/github/hoast/hoast-convert/master.svg?label=test%20coverage&style=flat-square&maxAge=3600)](https://codecov.io/gh/hoast/hoast-convert)
  
  [![License agreement](https://img.shields.io/github/license/hoast/hoast-convert.svg?style=flat-square&maxAge=86400)](https://github.com/hoast/hoast-convert/blob/master/LICENSE)
  [![Open issues on GitHub](https://img.shields.io/github/issues/hoast/hoast-convert.svg?style=flat-square&maxAge=86400)](https://github.com/hoast/hoast-convert/issues)
  
</div>

# hoast-convert

Convert the content of files using a specified function.

> As the name suggest this is a [hoast](https://github.com/hoast/hoast#readme) module.

> This is module is a little more advanced and is meant to be used for simple task that do not require a whole new module to be made. As a result a little more knowledge about [making modules](https://github.com/hoast/hoast#making) for hoast is recommended.

## Usage

Install [hoast-convert](https://npmjs.com/package/hoast-convert) using [npm](https://npmjs.com).

```
$ npm install hoast-convert
```

### Parameters

* `engine`: A function that processes the data and returns the new content. The parameters are the file path, file content, file frontmatter, and global metadata. The frontmatter is only used if the [frontmatter module](https://github.com/hoast/hoast-frontmatter#readme) is used. Do note the function can be asynchronous or return a promise. The function needs the return the new content in the form of a string.
  * Type: `Function`
	* Required: `yes`
* `extension`: The new extension name if it needs to change.
  * Type: `String`
	* Required: `no` 
* `patterns`: Glob patterns to match file paths with. If the engine function is set it will only give the function any files matching the pattern.
  * Type: `String` or `Array of strings`
	* Required: `no`
* `patternOptions`: Options for the glob pattern matching. See [planckmatch options](https://github.com/redkenrok/node-planckmatch#options) for more details on the pattern options.
  * Type: `Object`
  * Default: `{}`
* `patternOptions.all`: This options is added to `patternOptions`, and determines whether all patterns need to match instead of only one.
  * Type: `Boolean`
  * Default: `false`

### Example

**CLI**

Not compatible with the CLI tool as it requires a reference to a self specified function.

**Script**

```javascript
const Hoast = require(`hoast`);
const read = Hoast.read,
      convert = require(`hoast-convert`);
const minifyHTML = require(`html-minifier`).minify;

Hoast(__dirname)
  .use(read())
  .use(convert({
    engine: function(path, content, frontmatter, metadata) {
      return minifyHTML(content);
    },
    extension: `min.html`,
    patterns: `**/*.html`,
    patternOptions: {
      globstar: true
    }
  }))
  .process();
```

> In the example the HTML files are minified using [html-minifier](https://github.com/kangax/html-minifier#readme) and `min` is prepended to the extension.

## License

[ISC license](https://github.com/hoast/hoast-convert/blob/master/LICENSE)