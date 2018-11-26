let url = require('url');
let auth = require(__dirname + '/service/auth.js');
let static = require(__dirname + '/service/static.js');
let errors = require(__dirname + '/service/errors.js');

const SAFE_PAGES = [ '/api/auth/login', '/api/auth/login', '/login.html', '/loginfailed.html' ];
const START_PAGE = '/login.html';
const API_REGEX = new RegExp('^/api/([a-z]+)/.*$');

exports.dispatch = async (request, response) => {
	let u = url.parse(request.url);
	console.log(`Dispatching ${request.method} ${u.pathname}`);

	try {
		if (!SAFE_PAGES.includes(u.pathname) && !await auth.isLoggedIn(request)) {
			// redirect unauthed users to static/login.html
			response.writeHead(302, {'Location': START_PAGE});
			response.end();
		} else if (u.pathname.startsWith('/api/')) {
			// rewrite /api/foo/whatever to api/foo.js->handleAPI()
			let matches = u.pathname.match(API_REGEX);
			if (!matches) {
				return errors.abortRequest(request, response, 500, 'Unrecognized API');
			}
			let api = require(__dirname + '/api/' + matches[1] + '.js');
			await api.handleAPI(request, response);
		} else {
			// otherwise serve static/*.html
			static.serve(request, response);
		}
	}
	catch (e) {
		console.log(`Caught exception: ${e} ${e.stack}`);
		return errors.abortRequest(request, response, 500, 'Server error');
	}
};
