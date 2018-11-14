let auth = require(__dirname + '/../service/auth.js');
let assert = require('assert');

assert.strictEqual(auth.checkLogin('testuser', 'testpass'), true);
assert.strictEqual(auth.checkLogin('', ''), false);
assert.strictEqual(auth.checkLogin(null, null), false);
assert.strictEqual(auth.checkLogin(undefined, undefined), false);
assert.strictEqual(auth.checkLogin('testuser', null), false);
assert.strictEqual(auth.checkLogin('testuser', ''), false);
assert.strictEqual(auth.checkLogin('testuser', undefined), false);
