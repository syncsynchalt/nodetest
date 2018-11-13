#!/usr/bin/env node

process.on('uncaughtException', (err) => {
	console.log('Uncaught exception: ' + err);
	process.exit(1);
})

let http = require('http');
let url = require('url');
let querystring = require('querystring');
let util = require('util'); // xxx remove

const POST_LIMIT_BYTES = 1000000;

function abortRequest(request, response, code, msg) {
	response.writeHead(code, {'Content-Type': 'text/plain'});
	response.end('Error: ' + msg + '\n');
	request.connection.destroy();
}

async function parsePostParams(request, response) {
	return new Promise((resolve, reject) => {
		let queryData = '';
		request.on('data', function(data) {
			queryData += data;
			if(queryData.length > POST_LIMIT_BYTES) {
				queryData = '';
				return abortRequest(request, response, 413, 'POST content too large');
			}
		});
		request.on('end', function() {
			resolve(querystring.parse(queryData));
		});
	});
}

function parseGetParams(request, response) {
	let u = url.parse(request.url, true);
	return u.query;
}

let server = http.createServer(async (request, response) => {
	let params;
	if (request.method === 'POST') {
		params = await parsePostParams(request, response);
	} else if (request.method === 'GET') {
		params = parseGetParams(request, response);
	} else {
		return abortRequest(request, response, 500, 'HTTP method not handled');
	}

	let u = url.parse(request.url);
console.log('---------');
// console.log('url:' + util.inspect(u));
console.log('path:' + u.path);
console.log('params:' + util.inspect(params));

	if (u.pathname === '/login') {
		if (request.method !== 'POST') {
			return abortRequest(request, response, 403, 'login must be a POST');
		}
		response.writeHead(200, {'Content-Type': 'text/plain'});
		response.end('Hello World\n');
	} else {
		response.writeHead(200, {'Content-Type': 'text/plain'});
		response.end('Hello World\n');
	}
}).listen(8082);

console.log("Listening on http://localhost:8082/");
