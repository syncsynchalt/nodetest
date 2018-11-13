let fs = require('fs');

exports.handleLogin = function handleLogin(request, response, params) {
	// check user and password
	// set a cookie
	response.writeHead(302, {
		'Set-Cookie': 'sessionToken=XXXX; path=/; expires=Mon, 13 Nov 2028 00:00:00 GMT',
		'Location': '/'
	});
	response.end('');
};

exports.handleLogout = function handleLogout(request, response, params) {
	response.writeHead(302, {
		'Set-Cookie': 'sessionToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT',
		'Location': '/login.html'
	});
	response.end('');
}
