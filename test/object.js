// Dependency modules.
const test = require(`ava`);
const emulateHoast = require(`./helpers/emulateHoast`);
// Library module.
const Convert = require(`../library`);

test(`object`, async function(t) {
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