let url = require('url');
let auth = require(__dirname + '/service/auth.js');
let static = require(__dirname + '/service/static.js');

const SAFE_PAGES = [ '/login.html', '/loginfailed.html' ];

exports.dispatch = function dispatchRequest(request, response, params) {
	let u = url.parse(request.url);

	if (u.pathname === '/login') {
		return auth.handleLogin(request, response, params);
	} else if (u.pathname === '/logout') {
		return auth.handleLogout(request, response, params);
	} else if (!SAFE_PAGES.includes(u.pathname) && !auth.isLoggedIn(request)) {
		response.writeHead(302, {'Location': SAFE_PAGES[0]});
		response.end();
	} else {
		return static.serve(request, response);
	}
};
