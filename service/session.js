let fs = require('fs');

const SESSION_DIR = __dirname + '/../sessions/';
const CHECK_SESSION_REGEX = /^[a-z0-9]+$/;

exports.create = function createSession(user) {
	let filename = randomString();
	fs.writeFileSync(SESSION_DIR + filename, user);
	return filename;
};

exports.lookup = function lookupSession(session) {
	if (!CHECK_SESSION_REGEX.test(session)) {
		return false;
	}
	try {
		let user = fs.readFileSync(SESSION_DIR + session);
		return user;
	}
	catch(err) {
		return false;
	}
};

exports.delete = function deleteSession(session) {
	if (CHECK_SESSION_REGEX.test(session)) {
		fs.unlink(SESSION_DIR + session, err => {
			if (err) {
				throw err;
			}
		});
	}
};

function randomString() {
	// credit to tbanik@github https://gist.github.com/6174/6062387
	return [...Array(20)].map(_=>(~~(Math.random()*36)).toString(36)).join('');
}