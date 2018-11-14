let fs = require('fs');

const CONFIGS_DIR = __dirname + '/../data/configs/';

let url = require('url');
let auth = require(__dirname + '/../service/auth.js');
let session = require(__dirname + '/../service/session.js');
let errors = require(__dirname + '/../service/errors.js');

exports.handleAPI = function handleAuthAPI(request, response, _params) {
	let u = url.parse(request.url);

	let result = {configurations: []};
	if (u.pathname === '/api/configs/') {
		// list all configs
		fs.readdir(CONFIGS_DIR, function(err, items) {
			if (err) {
				throw err;
			}
			promises = [];
			for (let item of items) {
				let p = new Promise((resolve, reject) => {
					fs.readFile(CONFIGS_DIR + '/' + item, (err, data) => {
						if (err) {
							reject(err);
						}
						let obj = JSON.parse(data);
						resolve(obj);
					});
				});
				promises.push(p);
			}
			Promise.all(promises).then((objs) => {
				result.configurations = objs;
				response.end(JSON.stringify(result, null, 2));
			});
		});
	} else {
		return errors.abortRequest(request, response, 500, 'Unrecognized API');
	}
};
