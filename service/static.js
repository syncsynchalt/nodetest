let url = require('url');
let fs = require('fs');

function sanitizePath(path) {
	// TODO - this is rough sanitization, not correct against proper use
	//
	// e.g. /foo/../bar should sanitize to /bar, but browsers
	// and decent clients typically don't send that anyway.
	//
	// Went with this rough version because getting it right can be
	// tricky so I wanted to start safe.
	//
	path = path.replace('/../', '/');
	while (path.startsWith('..')) {
		path = path.slice(2);
	}
	while (path.endsWith('/..')) {
		path = path.slice(0, path.length-2);
	}
	return path;
}

exports.serve = function serveStatic(request, response, _params) {
	let path;
	if (typeof request === 'string') {
		path = request;
	} else {
		let u = url.parse(request.url);
		path = sanitizePath(u.pathname);
	}
	if (path === '/') {
		path = '/index.html';
	}

	const stream = fs.createReadStream(__dirname + '/../static/' + path);
	stream.on('error', function(err) {
		if (err.code === 'ENOENT') {
			response.writeHead(404, {'Content-Type': 'text/plain'});
			response.end('File does not exist\n');
		} else {
			response.writeHead(500, {'Content-Type': 'text/plain'});
			response.end('Server error\n');
		}
	});
	stream.pipe(response);
};
