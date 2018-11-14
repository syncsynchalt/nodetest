let session = require(__dirname + '/../service/session.js');
let assert = require('assert');

let sess = session.create('foo');
assert(sess);
assert.strictEqual(session.lookup(sess), 'foo');
session.delete(sess);

assert.strictEqual(session.lookup(''), false);
assert.strictEqual(session.lookup(null), false);
assert.strictEqual(session.lookup(undefined), false);
