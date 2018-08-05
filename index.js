// Node modules.
const assert = require('assert');
// If debug available require it.
let debug; try { debug = require('debug')('hoast-convert'); } catch(error) { debug = function() {}; }
// Dependency modules.
const nanomatch = require('nanomatch');

/**
 * Validates the module options.
 * @param {Object} options The options.
 */
const validateOptions = function(options) {
	assert(typeof(options) === 'object', 'hoast-convert: options must be of type object.');
	assert(typeof(options.engine) === 'function', 'hoast-convert: engine must be specified and of type function.');
	if (options.extension) {
		assert(typeof(options.extension) === 'string', 'hoast-convert: extension must be of type string.');
	}
	if (options.patterns) {
		assert(Array.isArray(options.patterns)  && options.patterns.length, 'hoast-convert: patterns needs must be specified and an array of strings.');
	}
};

/**
 * Convert the content of files.
 * @param {Object} options The module options.
 */
module.exports = function(options) {
	debug(`Initializing module.`);
	
	validateOptions(options);
	debug(`Validated options.`);
	options = Object.assign({
		patterns: [
			'**'
		]
	}, options);
	
	return async function(hoast, files) {
		debug(`Running module.`);
		await Promise.all(
			// Loop through files.
			files.map(function(file) {
				return new Promise(function(resolve) {
					debug(`Processing file '${file.path}'.`);
					
					assert(file.content !== null, 'hoast-convert: No content found on file, read module needs to be called before this.');
					// Has to match patterns.
					if (file.content.type !== 'string' || (options.patterns && options.patterns.length > 0 && !nanomatch.any(file.path, options.patterns))) {
						debug(`File not valid for processing.`);
						return resolve();
					}
					debug(`File data is valid.`);
					
					// Overwrite content with converted content.
					options.engine(file.path, file.content.data, file.frontmatter, hoast.options.metadata)
						.then(function(result) {
							if (typeof(result) === 'string') {
								file.content.data = result;
							} else if (typeof(result) === 'object') {
								if (result.path !== undefined) {
									file.path = result.path;
								}
								if (file.content.data !== undefined) {
									file.content.data = result.content;
								}
							}
							debug(`File data converted.`);
							
							// Replace file extension.
							if (options.extension) {
								file.path = file.path.substr(0, file.path.lastIndexOf('.')).concat(options.extension);
								debug(`Replacing file extension to '${file.path}'.`);
							}
							resolve();
						});
				})
			})
		);
	};
};