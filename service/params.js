let url = require('url');
let querystring = require('querystring');
let postdata = require(__dirname + '/postdata.js');

exports.parse = async (request, response) => {
	if (request.method === 'GET') {
		let u = url.parse(request.url, true);
		return u.query;
	} else {
		let query = await(postdata.get(request, response));
		return querystring.parse(query);
	}
};
