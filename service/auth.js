let crypto = require('crypto');
let session = require(__dirname + '/session.js');
let fspromise = require(__dirname + '/fspromise.js');

let userData;
let userDataPromise;

async function loadUserData() {
	if (userData) {
		return userData;
	}
	if (userDataPromise) {
		return userDataPromise;
	}
	userDataPromise = fspromise.readFile(__dirname + '/../users.json', 'utf8').then((data) => {
		userData = JSON.parse(data);
		return userData;
	});
	return userDataPromise;
}

exports.checkLogin = async (user, pass) => {
	let u = await loadUserData();
	user = user || '';
	pass = pass || '';

	// todo - work out our utf-8 serialization strategy
	// in a real application this would be bcrypt instead of sha256
	let hashedPass = crypto.createHash('sha256').update(pass).digest('hex');
	return !!(user && pass && hashedPass === u[user]);
};

exports.isLoggedIn = async (request) => {
	let sess = await session.getFromHttpRequest(request);
	return (sess !== false && session.lookup(sess) !== false);
};
