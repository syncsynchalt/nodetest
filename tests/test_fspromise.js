let fspromise = require(__dirname + '/../service/fspromise.js');
let assert = require('assert');

assert.doesNotReject(async () => {
	let data = await fspromise.readFile(__dirname + '/test_fspromise.js');
	assert.equal(data.slice(0, 4), 'let ');
	await fspromise.writeFile('/tmp/foo_test.txt', 'bing bong\n', 'utf8');
	data = await fspromise.readFile('/tmp/foo_test.txt', 'utf8');
	assert.equal(data, 'bing bong\n');
	await fspromise.unlink('/tmp/foo_test.txt');
});
