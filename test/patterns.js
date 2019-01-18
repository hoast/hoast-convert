// Dependency modules.
const test = require(`ava`);
const emulateHoast = require(`./helpers/emulateHoast`);
// Library module.
const Convert = require(`../library`);

test(`patterns`, async function(t) {
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