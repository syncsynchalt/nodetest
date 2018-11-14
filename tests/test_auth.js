let auth = require(__dirname + '/../service/auth.js');

if (auth.checkLogin('testuser', 'testpass') !== true) {
	throw new Error('test login failed, should have succeeded');
}
if (auth.checkLogin('', '') !== false) {
	throw new Error('empty login failed, should have succeeded');
}
if (auth.checkLogin(null, null) !== false) {
	throw new Error('null login failed, should have succeeded');
}
if (auth.checkLogin(undefined, undefined) !== false) {
	throw new Error('null login failed, should have succeeded');
}
if (auth.checkLogin('testuser', null) !== false) {
	throw new Error('test/null login failed, should have succeeded');
}
if (auth.checkLogin('testuser', '') !== false) {
	throw new Error('test/blank login failed, should have succeeded');
}
if (auth.checkLogin('testuser', undefined) !== false) {
	throw new Error('test/undefined login failed, should have succeeded');
}
