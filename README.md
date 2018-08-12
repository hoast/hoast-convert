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