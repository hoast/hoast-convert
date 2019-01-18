// Dependency modules.
const test = require(`ava`);
const emulateHoast = require(`./helpers/emulateHoast`);
// Library module.
const Convert = require(`../library`);

test(`metadata`, async function(t) {
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