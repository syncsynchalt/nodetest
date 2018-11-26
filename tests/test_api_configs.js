let configs = require(__dirname + '/../api/configs.js');
let assert = require('assert');

assert.doesNotReject(async () => {
	assert.strictEqual(await configs.exists('host1'), true);
	assert.strictEqual(await configs.exists('____does_not_exist___'), false);
});
