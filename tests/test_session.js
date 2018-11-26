let session = require(__dirname + '/../service/session.js');
let assert = require('assert');

assert.doesNotReject(async () => {
	let sess = await session.create('foo');
	assert(sess);
	assert.strictEqual(await session.lookup(sess), 'foo');
	await session.delete(sess);
}).catch(err => {
	console.error(`${err}`);
	require('process').exit(1);
});

assert.doesNotReject(async () => {
	assert.strictEqual(await session.lookup(''), false);
	assert.strictEqual(await session.lookup(null), false);
	assert.strictEqual(await session.lookup(undefined), false);
}).catch(err => {
	console.error(`${err}`);
	require('process').exit(1);
});
