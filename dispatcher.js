let url = require('url');
let login = require(__dirname + '/service/login.js');
let static = require(__dirname + '/service/static.js');

exports.dispatch = function dispatchRequest(request, response, params) {
	let u = url.parse(request.url);

	if (u.pathname === '/login') {
		return login.handleLogin(request, response, params);
	} else if (u.pathname === '/logout') {
		return login.handleLogout(request, response, params);
	} else {
		return static.serve(request, response);
	}
};
