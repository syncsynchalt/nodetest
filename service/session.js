let fs = require('fs');

const SESSION_DIR = __dirname + '/../sessions/';
const CHECK_SESSION_REGEX = /^[a-z0-9]+$/;

exports.create = function createSession(user) {
	let filename = randomString();
	fs.writeFileSync(SESSION_DIR + filename, user, 'utf8');
	return filename;
};

exports.lookup = function lookupSession(session) {
	if (!CHECK_SESSION_REGEX.test(session)) {
		return false;
	}
	try {
		let user = fs.readFileSync(SESSION_DIR + session, 'utf8');
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

exports.getFromHttpRequest = function getSessionFromRequest(request) {
	if (!request || !request.headers || !request.headers.cookie) {
		return false;
	}
	let cookies = request.headers.cookie.split(';');
	for (let cookie of cookies) {
		cookie = cookie.trim();
		if (cookie.startsWith('sessionToken=')) {
			return cookie.slice('sessionToken='.length);
		}
	}
	return false;
};

function randomString() {
	// credit to tbanik@github https://gist.github.com/6174/6062387
	return [...Array(20)].map(_=>(~~(Math.random()*36)).toString(36)).join('');
}
