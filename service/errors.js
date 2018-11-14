exports.abortRequest = function abortRequest(request, response, code, msg) {
	response.writeHead(code, {'Content-Type': 'text/plain'});
	response.end('Error: ' + msg + '\n');
	request.connection.destroy();
};
