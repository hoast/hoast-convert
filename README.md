# Hoast-convert
Convert the content of files using a specified function.

> As the name suggest this is a [Hoast](https://github.com/hoast/hoast#readme) module.

## Usage

### Parameters

* `engine` **{Function}**: function that processes the data and returns the new content. The parameters are the file path, file content, file frontmatter, and global metadata. The frontmatter is only used if the [frontmatter module](https://github.com/hoast/hoast-frontmatter#readme) is used. Do note this function can be an asynchronous.
	* Required: `yes`
* `extension` **{String}**: The new extension name if it needs to change.
	* Required: `no`
* `patterns` **{Array of strings}**: An array of string which gets used to match files using glob patterns. See [nanomatch](https://github.com/micromatch/nanomatch#readme) for more details on the patterns.
	* Required: `no`

### Example

**CLI**

Not compatible with the CLI tool as it requires a reference to a self written function.

**Script**

```javascript
const Hoast = require('hoast');
const read = Hoast.read,
      convert = require('hoast-convert');
const CleanCSS = require('clean-css');

const cleanCSS = new CleanCSS();

Hoast(__dirname)
  .use(read())
  .use(convert({
    engine: function(path, content, frontmatter, metadata) {
      return cleanCSS.minify(content);
    },
    extension: 'min.css',
    patterns: [
      '**/*.css'
    ]
  }))
  .process();
```

> In the example the CSS files are minified using [CleanCSS](https://github.com/jakubpawlowicz/clean-css#readme) and the `min` is prepended to the extension.

## License
[ISC license](https://github.com/hoast/hoast-convert/blob/master/LICENSE)