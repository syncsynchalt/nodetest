let url = require('url');
let auth = require(__dirname + '/../service/auth.js');
let session = require(__dirname + '/../service/session.js');
let errors = require(__dirname + '/../service/errors.js');

exports.handleAPI = function handleAuthAPI(request, response, params) {
	let u = url.parse(request.url);

	if (u.pathname === '/api/auth/login') {
		let user = params.user || 'unset';
		let pass = params.pass || '';

		if (!auth.checkLogin(user, pass)) {
			response.writeHead(302, {
				'Set-Cookie': 'sessionToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT',
				'Location': '/loginfailed.html'
			});
			response.end();
		} else {
			let sess = session.create(user);
			// set a cookie
			response.writeHead(302, {
				// xxx todo dynamic date
				'Set-Cookie': 'sessionToken=' + sess + '; path=/; expires=Mon, 13 Nov 2028 00:00:00 GMT',
				'Location': '/'
			});
			response.end();
		}
	} else if (u.pathname === '/api/auth/logout') {
		let sess = session.getFromHttpRequest(request);
		if (sess !== false) {
			session.delete(sess);
		}
		response.writeHead(302, {
			'Set-Cookie': 'sessionToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT',
			'Location': '/login.html'
		});
		response.end();
	} else {
		return errors.abortRequest(request, response, 500, 'Unrecognized API');
	}
};
