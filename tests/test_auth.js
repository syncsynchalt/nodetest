let auth = require(__dirname + '/../service/auth.js');
let assert = require('assert');

assert.doesNotReject(async () => {
	assert.strictEqual(await auth.checkLogin('testuser', 'testpass'), true);
	assert.strictEqual(await auth.checkLogin('', ''), false);
	assert.strictEqual(await auth.checkLogin(null, null), false);
	assert.strictEqual(await auth.checkLogin(undefined, undefined), false);
	assert.strictEqual(await auth.checkLogin('testuser', null), false);
	assert.strictEqual(await auth.checkLogin('testuser', ''), false);
	assert.strictEqual(await auth.checkLogin('testuser', undefined), false);
}).catch(err => {
	console.error(`${err}`);
	require('process').exit(1);
});
