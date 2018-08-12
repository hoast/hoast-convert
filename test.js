// Node modules.
const { extname } = require(`path`);
// Dependecy modules.
const test = require(`ava`);
// Custom module.
const Convert = require(`.`);

test(`convert`, async function(t) {
	// Create dummy hoast data.
	const hoast = {
		options: {
			metadata: {
				title: `convert`
			}
		}
	};
	
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
	
	// Create module options.
	const options = {
		engine: function(path, content, frontmatter, metadata) {
			t.is(extname(path), `.md`);
			t.is(typeof(content), `string`);
			t.is(typeof(frontmatter), `object`);
			t.is(metadata, hoast.options.metadata);
			
			return JSON.stringify(frontmatter);
		},
		extension: `.frontmatter`,
		patterns: `**/*.md`
	};
	
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
	const convert = Convert(options);
	await convert(hoast, files);
	// Compare files.
	t.deepEqual(files, filesOutcome);
});