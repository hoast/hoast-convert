// Dependency modules.
const test = require(`ava`);
const emulateHoast = require(`./helpers/emulateHoast`);
// Library module.
const Convert = require(`../library`);

test(`filedata`, async function(t) {
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