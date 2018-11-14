#!/usr/bin/env node

let http = require('http');
let dispatcher = require(__dirname + '/dispatcher.js');
let errors = require(__dirname + '/service/errors.js');

http.createServer(async (request, response) => {
	try {
		return await dispatcher.dispatch(request, response);
	}
	catch (err) {
		console.error('Aborting on error ' + err);
		console.error(err.stack);
		errors.abortRequest(request, response, 500, 'Internal server error');
	}
}).listen(8082);

console.log('Listening on http://localhost:8082/');
