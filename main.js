#!/usr/bin/env node

let http = require('http');
let url = require('url');
let querystring = require('querystring');
let dispatcher = require(__dirname + '/dispatcher.js');
let errors = require(__dirname + '/service/errors.js');

const POST_LIMIT_BYTES = 1000000;

async function parsePostParams(request, response) {
	return new Promise((resolve, _reject) => {
		let queryData = '';
		request.on('data', function(data) {
			queryData += data;
			if(queryData.length > POST_LIMIT_BYTES) {
				queryData = '';
				return errors.abortRequest(request, response, 413, 'POST content too large');
			}
		});
		request.on('end', function() {
			resolve(querystring.parse(queryData));
		});
	});
}

function parseGetParams(request, _reject) {
	let u = url.parse(request.url, true);
	return u.query;
}

http.createServer(async (request, response) => {
	let params;
	if (request.method === 'POST') {
		params = await parsePostParams(request, response);
	} else if (request.method === 'GET') {
		params = parseGetParams(request, response);
	} else {
		return errors.abortRequest(request, response, 500, 'HTTP method not handled');
	}

	return dispatcher.dispatch(request, response, params);
}).listen(8082);

console.log('Listening on http://localhost:8082/');
