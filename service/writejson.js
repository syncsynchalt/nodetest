exports.write = (data, response) => {
	if (typeof data === 'object') {
		data = JSON.stringify(data, null, 2);
	}
	response.writeHead(200, {'Content-Type': 'text/json'});
	response.end(data);
};
