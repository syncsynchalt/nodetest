let params = require(__dirname + '/../service/params.js');
let assert = require('assert');

let req = {
	method: 'GET',
	url: '/foo?bar=baz&bux=buzz'
};
let p = params.parse(req, {});
p.then(result => {
	assert.deepEqual(result, {bar:'baz', bux:'buzz'});
});

let mockedRequest = new require('stream').Readable();
mockedRequest._read = () => {};

p = params.parse(mockedRequest, {});
mockedRequest.emit('data', 'foo=bar&baz=bux');
mockedRequest.emit('end');
p.then(result => {
	assert.deepEqual(result, {foo:'bar', baz:'bux'});
});
