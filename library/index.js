// If debug available require it.
let debug; try { debug = require(`debug`)(`hoast-convert`); } catch(error) { debug = function() {}; }
// Node modules.
const assert = require(`assert`);
// Dependency modules.
const parse = require(`planckmatch/parse`),
	match = require(`planckmatch/match`);

/**
 * Validates the module options.
 * @param {Object} options The options.
 */
const validateOptions = function(options) {
	assert(
		typeof(options) === `object`,
		`hoast-convert: options must be of type object.`
	);
	
	assert(
		typeof(options.engine) === `function`,
		`hoast-convert: engine must be specified and of type function.`
	);
	if (options.extension) {
		assert(
			typeof(options.extension) === `string`,
			`hoast-convert: extension must be of type string.`
		);
	}
	
	if (options.patterns) {
		assert(
			typeof(options.patterns) === `string` || (Array.isArray(options.patterns) && options.patterns.length > 0 && typeof(options.patterns[0] === `string`)),
			`hoast-convert: patterns must be of type string or an array of string.`
		);
	}
	if (options.patternOptions) {
		assert(
			typeof(options.patternOptions) === `object`,
			`hoast-convert: patternOptions must be of type object.`
		);
		if (options.patternOptions.all) {
			assert(
				typeof(options.patternOptions.all) === `boolean`, 
				`hoast-convert: patternOptions.all must be of type boolean.`
			);
		}
	}
};

/**
 * Check if expressions match with the given value.
 * @param {String} value The string to match with the expressions.
 * @param {RegExps|Array} expressions The regular expressions to match with.
 * @param {Boolean} all Whether all patterns need to match.
 */
const isMatch = function(value, expressions, all) {
	// If no expressions return early as valid.
	if (!expressions) {
		return true;
	}
	
	const result = match(value, expressions);
	
	// If results is a boolean check if it is true.
	if (typeof(result) === `boolean` && result) {
		return true;
	}
	// If results is an array check whether everything needs to be true or any will be enough.
	if (Array.isArray(result) && (all ? !result.includes(false) : result.includes(true))) {
		return true;
	}
	
	// Otherwise it is no match.
	return false;
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
		patternOptions: {}
	}, options);
	
	const mod = async function(hoast, files) {
		debug(`Running module.`);
		await Promise.all(
			// Loop through files.
			files.map(async function(file) {
				debug(`Processing file '${file.path}'.`);
				
				// Check if read module has been used.
				assert(
					file.content !== null,
					`hoast-convert: No content found on file, read module needs to be called before this.`
				);
				
				// Check if file content is text.
				if (file.content.type !== `string`) {
					debug(`File content not valid for processing.`);
					return;
				}
				// Check against glob patterns.
				if (!isMatch(file.path, this.expressions, options.patternOptions.all)) {
					debug(`File path not valid for processing.`);
					return;
				}
				
				debug(`File data is valid.`);
				
				// Call engine function to get new content.
				file.content.data = await options.engine(file.path, file.content.data, file.frontmatter, hoast.options.metadata);
				assert(typeof(file.path) === `string`, `hoast-rename: file content must be of type string.`);
				debug(`File data converted.`);
				
				// Replace file extension.
				if (options.extension) {
					file.path = file.path.substr(0, file.path.lastIndexOf(`.`)).concat(options.extension);
					debug(`Replacing file extension to '${file.path}'.`);
				}
			}, mod)
		);
	};
	
	mod.before = function() {
		debug(`Running module before.`);
		
		// Parse glob patterns into regular expressions.
		if (options.patterns) {
			this.expressions = parse(options.patterns, options.patternOptions, true);
		}
	};
	
	return mod;
};