<div align="center">
  <a title="Version master branch" href="https://github.com/hoast/hoast-convert#readme" target="_blank" rel="noopener">
    <img src="https://img.shields.io/github/package-json/v/hoast/hoast-convert.svg?label=master&style=flat-square"/>
  </a>
  <a title="Version npm package" href="https://npmjs.com/package/hoast-convert" target="_blank" rel="noopener">
    <img src="https://img.shields.io/npm/v/hoast-convert.svg?label=npm&style=flat-square"/>
  </a>
  <a title="License agreement" href="https://github.com/hoast/hoast-convert/blob/master/LICENSE" target="_blank" rel="noopener">
    <img src="https://img.shields.io/github/license/hoast/hoast-convert.svg?style=flat-square"/>
  </a>
  <a title="Travis-ci build statis" href="https://travis-ci.org/hoast/hoast-convert" target="_blank" rel="noopener">
    <img src="https://img.shields.io/travis-ci/hoast/hoast-convert.svg?branch=master&style=flat-square"/>
  </a>
  <a title="Open issues on GitHub" href="https://github.com/hoast/hoast-convert/issues" target="_blank" rel="noopener">
    <img src="https://img.shields.io/github/issues/hoast/hoast-convert.svg?style=flat-square"/>
  </a>
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

* `engine` **{Function}**: function that processes the data and returns the new content. The parameters are the file path, file content, file frontmatter, and global metadata. The frontmatter is only used if the [frontmatter module](https://github.com/hoast/hoast-frontmatter#readme) is used. Do note the function can be asynchronous or return a promise. The function needs the return the new content in the form of a string.
	* Required: `yes`
* `extension` **{String}**: The new extension name if it needs to change.
	* Required: `no`
* `patterns` **{Array|strings}**: A string or an array of strings which gets used to match files using glob patterns. See [nanomatch](https://github.com/micromatch/nanomatch#readme) for more details on the patterns.
	* Required: `no`

### Example

**CLI**

Not compatible with the CLI tool as it requires a reference to a self written function.

**Script**

```javascript
const Hoast = require(`hoast`);
const read = Hoast.read,
      convert = require(`hoast-convert`);
const minifyJS = require(`uglify-js`).minify;

Hoast(__dirname)
  .use(read())
  .use(convert({
    engine: function(path, content, frontmatter, metadata) {
      return minifyJS(content);
    },
    extension: `min.js`,
    patterns: `**/*.js`
  }))
  .process();
```

> In the example the JS files are minified using [uglify-js](https://github.com/mishoo/UglifyJS2#readme) and the `min` is prepended to the extension.

## License

[ISC license](https://github.com/hoast/hoast-convert/blob/master/LICENSE)