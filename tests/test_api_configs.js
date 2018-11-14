let configs = require(__dirname + '/../api/configs.js');
let assert = require('assert');

assert.strictEqual(configs.exists('host1'), true);
assert.strictEqual(configs.exists('____does_not_exist___'), false);
