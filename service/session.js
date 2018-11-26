let fspromise = require(__dirname + '/fspromise.js');

const SESSION_DIR = __dirname + '/../sessions/';
const CHECK_SESSION_REGEX = /^[a-z0-9]+$/;

exports.create = async (user) => {
	let filename = randomString();
	return fspromise.writeFile(SESSION_DIR + filename, user, 'utf8').then(() => {return filename;});
};

exports.lookup = async (session) => {
	if (!CHECK_SESSION_REGEX.test(session)) {
		return false;
	}
	return fspromise.readFile(SESSION_DIR + session, 'utf8').catch(() => { return false; });
};

exports.delete = async (session) => {
	if (!CHECK_SESSION_REGEX.test(session)) {
		throw Error('Bad session');
	}
	return fspromise.unlink(SESSION_DIR + session);
};

exports.getFromHttpRequest = (request) => {
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
