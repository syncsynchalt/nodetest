let postdata = require(__dirname + '/../service/postdata.js');
let assert = require('assert');

let mockedRequest = new require('stream').Readable();
mockedRequest._read = () => {};

let p = postdata.get(mockedRequest, {});
mockedRequest.emit('data', 'foo=bar&baz=bux');
mockedRequest.emit('end');
p.then(result => {
	assert.strictEqual(result, 'foo=bar&baz=bux');
});

mockedRequest = new require('stream').Readable();
mockedRequest._read = () => {};

p = postdata.get(mockedRequest, {});
mockedRequest.emit('data', 'foo=bar');
mockedRequest.emit('data', '&baz=bux');
mockedRequest.emit('end');
p.then(result => {
	assert.strictEqual(result, 'foo=bar&baz=bux');
});
