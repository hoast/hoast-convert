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
		// Store results of asynchronous functions.
		files = await Promise.all(
			// Loop through files.
			files.map(async function(file) {
				debug(`Processing file '${file.path}'.`);
				
				// Check against glob patterns.
				if (!hoast.helpers.matchExpressions(file.path, this.expressions, options.patternOptions.all)) {
					debug(`File path not valid for processing.`);
					return;
				}
				
				// Call the engine function with the file data and metadata.
				const results = await options.engine(file, hoast.options.metadata);
				debug(`File data converted, result is of type ${Array.isArray(results) ? `array` : typeof(results)}.`);
				
				// Check the type of the results and write.
				if (Array.isArray(results)) {
					file = results.map(function(result) {
						return hoast.helpers.deepAssign({}, file, result);
					});
					
					debug(`Duplicated old data, merged new data on top. Created ${file.length - 1} new files.`);
				} else if (typeof(results) === `object`) {
					file = hoast.helpers.deepAssign(file, results);
					
					debug(`Merged new onto old file data.`);
				}
				// If the file is a string only rewrite the content. (Scrapped)
				/* else if (typeof(results) === `string`) {
					if (!file.content || file.content.type !== `string`) {
						debug(`File did not already have content of type string, therefore results are discarded.`);
						return file;
					}
					
					file.content.data = results;
					
					debug(`Content overwritten with result.`);
				}*/
				
				// Replace file extension(s). (Scrapped)
				/* if (options.extension) {
					if (Array.isArray(file)) {
						file.forEach(function(file) {
							file.path.substr(0, file.path.lastIndexOf(`.`)).concat(options.extension);
						});
					} else {
						file.path = file.path.substr(0, file.path.lastIndexOf(`.`)).concat(options.extension);
					}
					debug(`Replaced file extension(s).`);
				}*/
				
				return file;
			}, mod)
		);
		
		// Flatten files array and return it.
		return files.reduce(function(previous, current) {
			if (!current) {
				return previous;
			}
			else if (Array.isArray(current)) {
				return previous.concat(current);
			} else {
				previous.push(current);
				return previous;
			}
		}, []);
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