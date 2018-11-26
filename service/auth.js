let fs = require('fs');
let crypto = require('crypto');
let session = require(__dirname + '/session.js');

let rawUserData = fs.readFileSync(__dirname + '/../users.json', 'utf8');
let userData = JSON.parse(rawUserData);

exports.checkLogin = (user, pass) => {
	user = user || '';
	pass = pass || '';

	// todo - work out our utf-8 serialization strategy
	// in a real application this would be bcrypt instead of sha256
	let hashedPass = crypto.createHash('sha256').update(pass).digest('hex');
	return !!(user && pass && hashedPass === userData[user]);
};

exports.isLoggedIn = async (request) => {
	let sess = await session.getFromHttpRequest(request);
	return (sess !== false && session.lookup(sess) !== false);
};
