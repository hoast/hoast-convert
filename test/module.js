// Node modules.
const path = require(`path`);
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

test(`convert`, async function(t) {
	// Create dummy files.
	const files = [{
		path: `a.txt`,
		content: {
			type: `string`,
			data: `example`
		}
	}, {
		path: `b.md`,
		
		content: {
			type: `string`,
			data: `data`
		},
		frontmatter: {
			content: `frontmatter`
		}
	}];
	
	// Expected outcome.
	const filesOutcome = [{
		path: `a.txt`,
		content: {
			type: `string`,
			data: `example`
		}
	}, {
		path: `b.frontmatter`,
		content: {
			type: `string`,
			data: JSON.stringify(files[1].frontmatter)
		},
		frontmatter: {
			content: `frontmatter`
		}
	}];
	
	// Test module.
	const hoastOptions = {
		metadata: {
			title: `convert`
		}
	};
	await emulateHoast(hoastOptions, Convert({
		engine: function(filePath, content, frontmatter, metadata) {
			t.is(path.extname(filePath), `.md`);
			t.is(typeof(content), `string`);
			t.is(content, `data`);
			t.is(typeof(frontmatter), `object`);
			t.is(metadata, hoastOptions.metadata);
			
			return JSON.stringify(frontmatter);
		},
		extension: `.frontmatter`,
		patterns: `*.md`
	}), files);
	
	// Compare files.
	t.deepEqual(files, filesOutcome);
});