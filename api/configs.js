let fs = require('fs');
let querystring = require('querystring');
let url = require('url');
let errors = require(__dirname + '/../service/errors.js');
let postdata = require(__dirname + '/../service/postdata.js');
let writejson = require(__dirname + '/../service/writejson.js');

const CONFIGS_DIR = __dirname + '/../data/configs/';

exports.handleAPI = async (request, response) => {
	let u = url.parse(request.url);

	let result = {configurations: []};
	if (request.method === 'GET' && u.pathname === '/api/configs/') {
		// list all configs
		fs.readdir(CONFIGS_DIR, function(err, items) {
			if (err) {
				throw err;
			}
			let promises = [];
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
				writejson.write(result, response);
			});
		});
	} else if (request.method === 'POST' && u.pathname === '/api/configs/') {
		// create a config
		postdata.get(request).then(data => {
			let config = JSON.parse(data);
			if (!config.name) {
				return errors.abortRequest(request, response, 500, 'No name given');
			}
			if (configExists(config.name)) {
				// known issue: race condition here
				return errors.abortRequest(request, response, 409, 'Already exists');
			}
			let file = getConfigFilename(config.name);
			fs.writeFile(file, data, 'utf8', (err) => {
				if (err) {
					throw err;
				}
				writejson.write({
					success: true,
					msg: 'created ' + config.name,
					uri: '/api/configs/' + querystring.escape(config.name)
				}, response);
			});
		});
	} else {
		return errors.abortRequest(request, response, 500, 'Unrecognized API');
	}
};

// expose for testing
exports.exists = configExists;

function configExists(name) {
	try {
		let file = getConfigFilename(name);
		fs.statSync(file);
		return true;
	}
	catch (err) {
		if (err.code === 'ENOENT') {
			return false;
		}
		throw err;
	}
}

function getConfigFilename(name) {
	return CONFIGS_DIR + querystring.escape(name) + '.json';
}
