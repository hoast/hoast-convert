// Dependency modules.
const Hoast = require(`hoast`),
	test = require(`ava`);
// Custom module.
const Convert = require(`../library`);

/**
 * Emulates a simplified Hoast process for testing purposes.
 * @param {Object} options Hoast options.
 * @param {Function} mod Module function.
 * @param {Array of objects} files The files to process and return.
 */
const emulateHoast = async function(options, mod, files) {
	const hoast = Hoast(__dirname, options);
	
	if (mod.before) {
		await mod.before(hoast);
	}
	
	const temp = await mod(hoast, files);
	if (temp) {
		files = temp;
	}
	
	if (mod.after) {
		await mod.after(hoast);
	}
	
	return files;
};

test(`pattern matching`, async function(t) {
	t.plan(1);
	
	// Create dummy files.
	const files = [{
		path: `a.css`
	}, {
		path: `b.js`
	}];
	
	// Test module.
	await emulateHoast(null, Convert({
		engine: function() {
			t.true(true);
		},
		patterns: `*.css`
	}), files);
});

test(`file data`, async function(t) {
	t.plan(1);
	
	// Create dummy files.
	const files = [{
		path: `a.css`
	}];
	
	// Test module.
	await emulateHoast(null, Convert({
		engine: function(file) {
			t.deepEqual(file, files[0]);
		}
	}), files);
});

test(`hoast metadata`, async function(t) {
	t.plan(1);
	
	// Create dummy files.
	const files = [{
		path: `a.css`
	}];
	
	// Test module.
	const hoastOptions = {
		metadata: {
			title: `Hello world!`
		}
	};
	await emulateHoast(hoastOptions, Convert({
		engine: function(file, metadata) {
			t.deepEqual(metadata, hoastOptions.metadata);
		}
	}), files);
});

test(`return null`, async function(t) {
	t.plan(1);
	
	// Create dummy files.
	let files = [{
		path: `a.css`
	}];
	
	// Expected outcome.
	const filesOutcome = [{
		path: `a.css`
	}];
	
	// Test module.
	files = await emulateHoast(null, Convert({
		engine: function() {
			return null;
		}
	}), files);
	
	// Compare files.
	t.deepEqual(files, filesOutcome);
});

test(`return object`, async function(t) {
	t.plan(1);
	
	// Create dummy files.
	let files = [{
		path: `a.css`
	}, {
		path: `b.js`
	}];
	
	// Expected outcome.
	const filesOutcome = [{
		path: `a.css`,
		content: {
			data: `Hello world!`
		}
	}, {
		path: `c.js`
	}];
	
	// Test module.
	files = await emulateHoast(null, Convert({
		engine: function(file) {
			if (file.path === `a.css`) {
				return {
					content: {
						data: `Hello world!`
					}
				};
			}
			return {
				path: `c.js`
			};
		}
	}), files);
	
	// Compare files.
	t.deepEqual(files, filesOutcome);
});

test(`return array`, async function(t) {
	t.plan(1);
	
	// Create dummy files.
	let files = [{
		path: `a.css`,
		content: {
			data: `Hello world!`
		}
	}];
	
	// Expected outcome.
	const filesOutcome = [{
		path: `a.css`,
		content: {
			data: `Hello world!`
		}
	}, {
		path: `b.css`,
		content: {
			data: `Hello world!`
		}
	}];
	
	// Test module.
	files = await emulateHoast(null, Convert({
		engine: function() {
			return [{
				path: `a.css`
			}, {
				path: `b.css`
			}];
		}
	}), files);
	
	// Compare files.
	t.deepEqual(files, filesOutcome);
});