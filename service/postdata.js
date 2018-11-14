let errors = require(__dirname + '/errors.js');

const POST_LIMIT_BYTES = 1000000;

exports.get = async (request, response) => {
	return new Promise((resolve, reject) => {
		let postData = '';
		request.on('data', function(data) {
			postData += data;
			if (postData.length > POST_LIMIT_BYTES) {
				postData = '';
				errors.abortRequest(request, response, 413, 'POST content too large');
				reject('POST content too large');
			}
		});
		request.on('end', function() {
			resolve(postData);
		});
	});
};
