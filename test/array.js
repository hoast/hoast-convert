// Dependency modules.
const test = require(`ava`);
const emulateHoast = require(`./helpers/emulateHoast`);
// Library module.
const Convert = require(`../library`);

test(`array`, async function(t) {
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