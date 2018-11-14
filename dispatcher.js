let url = require('url');
let auth = require(__dirname + '/service/auth.js');
let static = require(__dirname + '/service/static.js');
let errors = require(__dirname + '/service/errors.js');

const SAFE_PAGES = [ '/api/auth/login', '/api/auth/login', '/login.html', '/loginfailed.html' ];
const START_PAGE = '/login.html';
const API_REGEX = new RegExp('^/api/([a-z]+)/.*$');

exports.dispatch = function dispatchRequest(request, response, params) {
	let u = url.parse(request.url);
	console.log(`Dispatching ${u.pathname}`);

	if (!SAFE_PAGES.includes(u.pathname) && !auth.isLoggedIn(request)) {
		// redirect unauthed users to static/login.html
		response.writeHead(302, {'Location': START_PAGE});
		response.end();
	} else if (u.pathname.startsWith('/api/')) {
		// rewrite /api/foo/whatever to api/foo.js->handleAPI()
		let matches = u.pathname.match(API_REGEX);
		if (!matches) {
			return errors.abortRequest(request, response, 500, 'Unrecognized API');
		}
		try {
			let api = require(__dirname + '/api/' + matches[1] + '.js');
			api.handleAPI(request, response, params);
		}
		catch (e) {
			return errors.abortRequest(request, response, 500, 'Unrecognized API');
		}
	} else {
		// otherwise serve static/*.html
		static.serve(request, response);
	}
};
