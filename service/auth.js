let fs = require('fs');
let crypto = require('crypto');
let session = require(__dirname + '/session.js');

let rawUserData = fs.readFileSync(__dirname + '/../users.json', 'utf8');
let userData = JSON.parse(rawUserData);

exports.handleLogin = function handleLogin(request, response, params) {
	let user = params.user || 'unset';
	let pass = params.pass || '';
	// todo - work out our utf-8 serialization strategy
	let hashedPass = crypto.createHash('sha256').update(pass).digest('hex');

	// check user and password
	if (!user || !pass || hashedPass !== userData[user]) {
		response.writeHead(302, {
			'Set-Cookie': 'sessionToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT',
			'Location': '/loginfailed.html'
		});
		response.end('');
	} else {
		let sess = session.create(user);
		// set a cookie
		response.writeHead(302, {
			'Set-Cookie': 'sessionToken=' + sess + '; path=/; expires=Mon, 13 Nov 2028 00:00:00 GMT',
			'Location': '/'
		});
		response.end('');
	}
};

exports.handleLogout = function handleLogout(request, response, _params) {
	let sess = getSession(request);
	if (sess !== false) {
		session.delete(sess);
	}
	response.writeHead(302, {
		'Set-Cookie': 'sessionToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT',
		'Location': '/login.html'
	});
	response.end('');
};

exports.isLoggedIn = function isLoggedIn(request) {
	if (!request.headers.cookie) {
		return false;
	}
	let sess = getSession(request);
	return (sess !== false && session.lookup(sess) !== false);
};

function getSession(request) {
	let cookies = request.headers.cookie.split(';');
	for (let cookie of cookies) {
		cookie = cookie.trim();
		if (cookie.startsWith('sessionToken=')) {
			return cookie.slice('sessionToken='.length);
		}
	}
	return false;
}
