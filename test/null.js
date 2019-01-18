// Dependency modules.
const test = require(`ava`);
const emulateHoast = require(`./helpers/emulateHoast`);
// Library module.
const Convert = require(`../library`);

test(`null`, async function(t) {
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