let session = require(__dirname + '/../service/session.js');

let sess = session.create('foo');
if (!sess) {
	throw new Error('create session failed, should have succeeded');
}
if (session.lookup(sess) !== 'foo') {
	throw new Error('lookup session failed, should have succeeded');
}
session.delete(sess);

if (session.lookup('') !== false) {
	throw new Error('lookup session blank succeeded, should have failed');
}
if (session.lookup(null) !== false) {
	throw new Error('lookup session null succeeded, should have failed');
}
if (session.lookup(undefined) !== false) {
	throw new Error('lookup session undefined succeeded, should have failed');
}
