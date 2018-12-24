<div align="center">
  
  [![npm package version @latest](https://img.shields.io/npm/v/hoast-convert.svg?label=npm@latest&style=flat-square&maxAge=3600)](https://npmjs.com/package/hoast-convert)
  [![npm package version @next](https://img.shields.io/npm/v/hoast-convert/next.svg?label=npm@next&style=flat-square&maxAge=3600)](https://npmjs.com/package/hoast-convert/v/next)
  
  [![Travis-ci test status](https://img.shields.io/travis-ci/hoast/hoast-convert.svg?branch=master&label=test%20status&style=flat-square&maxAge=3600)](https://travis-ci.org/hoast/hoast-convert)
  [![CodeCov test coverage](https://img.shields.io/codecov/c/github/hoast/hoast-convert/master.svg?label=test%20coverage&style=flat-square&maxAge=3600)](https://codecov.io/gh/hoast/hoast-convert)
  
  [![License agreement](https://img.shields.io/github/license/hoast/hoast-convert.svg?style=flat-square&maxAge=86400)](https://github.com/hoast/hoast-convert/blob/master/LICENSE)
  [![Open issues on GitHub](https://img.shields.io/github/issues/hoast/hoast-convert.svg?style=flat-square&maxAge=86400)](https://github.com/hoast/hoast-convert/issues)
  
</div>

# hoast-convert

Convert the content of files using a specified function.

> As the name suggest this is a [hoast](https://github.com/hoast/hoast#readme) module.

> This module is meant to be used for simple task that do not require a whole new module to be made. As a result a little more knowledge on [how to making modules](https://github.com/hoast/hoast#making) is recommended.

## Usage

Install [hoast-convert](https://npmjs.com/package/hoast-convert) using [npm](https://npmjs.com).

```
$ npm install hoast-convert
```

### Parameters

* `engine`: The file processing function which gets given two parameters, the file data and the hoast metadata. The return can be an object, which gets merged with the pre-existing file, or an array of objects, whereby each item in the array becomes a new file and gets merged with the pre-existing file.
  * Type: `Function`
	* Required: `yes`
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
    engine: function(file, metadata) {
      return {
        content: {
          data: minifyHTML(file.content.data)
        }
      };
    },
    patterns: `*.html`
  }))
  .process();
```

> In the example above the HTML files are minified using [html-minifier](https://github.com/kangax/html-minifier#readme).

```javascript
const Hoast = require(`hoast`);
const read = Hoast.read,
      convert = require(`hoast-convert`);
const babel = require(`@babel/core`);

Hoast(__dirname)
  .use(read())
  .use(convert({
    engine: async function(file, metadata) {
      const result = await babel.transformAsync(file.content.data, { code: true, map: true });
      return [{
        content: {
          data: result.code
        }
      }, {
        path: file.path.substring(0, file.lastIndexOf(`.`)).concat(`.map.js`);
        content: {
          data: result.map
        }
      }];
    },
    patterns: `*.js`
  }))
  .process();
```

> In the example above the JavaScript files are transformed using [Babel](https://github.com/babel/babel#readme), and an additional `.map.js` file is created. Do note Babel requires more setup than is shown in the example.

```javascript
const Hoast = require(`hoast`);
const read = Hoast.read,
      convert = require(`hoast-convert`);

Hoast(__dirname, {
  metadata: {
    hello: `World!`
  }
})
  .use(read())
  .use(convert({
    engine: function(file, metadata) {
      console.log(JSON.Stringify(metadata));
    }
  }))
  .process();
```

> In the example above the metadata will be printed to the console as `{ hello: "World!" }`.