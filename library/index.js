// If debug available require it.
let debug; try { debug = require(`debug`)(`hoast-convert`); } catch(error) { debug = function() {}; }

/**
 * Convert the content of files.
 * @param {Object} options The module options.
 */
module.exports = function(options) {
	debug(`Initializing module.`);
	
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
				if (file.content === null) {
					debug(`File content not set, read module needs to be called before this.`);
					return;
				}
				
				// Check if file content is text.
				if (file.content.type !== `string`) {
					debug(`File content not valid for processing.`);
					return;
				}
				// Check against glob patterns.
				if (!hoast.helpers.matchExpressions(file.path, this.expressions, options.patternOptions.all)) {
					debug(`File path not valid for processing.`);
					return;
				}
				
				debug(`File data is valid.`);
				
				// Call engine function to get new content.
				file.content.data = await options.engine(file.path, file.content.data, file.frontmatter, hoast.options.metadata);
				debug(`File data converted.`);
				
				// Replace file extension.
				if (options.extension) {
					file.path = file.path.substr(0, file.path.lastIndexOf(`.`)).concat(options.extension);
					debug(`Replacing file extension to '${file.path}'.`);
				}
			}, mod)
		);
	};
	
	mod.before = function(hoast) {
		// Parse glob patterns into regular expressions.
		if (options.patterns) {
			this.expressions = hoast.helpers.parsePatterns(options.patterns, options.patternOptions, true);
			debug(`Patterns parsed into expressions: ${this.expressions}.`);
		}
	};
	
	return mod;
};