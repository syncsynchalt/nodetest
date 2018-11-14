exports.write = (data, response, code) => {
	code = code || 200;
	if (typeof data === 'object') {
		data = JSON.stringify(data, null, 2);
	}
	response.writeHead(code, {'Content-Type': 'text/json'});
	response.end(data);
};
