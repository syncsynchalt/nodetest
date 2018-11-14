let fs = require('fs');
let querystring = require('querystring');
let url = require('url');
let errors = require(__dirname + '/../service/errors.js');
let postdata = require(__dirname + '/../service/postdata.js');
let writejson = require(__dirname + '/../service/writejson.js');
let params = require(__dirname + '/../service/params.js');

const CONFIGS_DIR = __dirname + '/../data/configs/';

exports.handleAPI = async (request, response) => {
	let u = url.parse(request.url);

	let result = {configurations: []};
	if (request.method === 'GET' && u.pathname === '/api/configs/') {
		// list all configs

		let parms = await params.parse(request);

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
				if (parms.sortKey) {
					let k = parms.sortKey;
					objs = objs.sort((a, b) => {
						if ((!a[k] && !b[k]) || a[k] == b[k]) {
							return 0;
						} else if (!a[k] || a[k] < b[k]) {
							return -1;
						} else {
							return 1;
						}
					});
				}
				if (parms.offset && isInt(parms.offset)) {
					objs = objs.slice(parseInt(parms.offset, 10));
				}
				if (parms.limit && isInt(parms.limit)) {
					objs = objs.slice(0, parseInt(parms.limit, 10));
				}
				result.configurations = objs;
				writejson.write(result, response);
			});
		});
	} else if (request.method === 'GET') {
		// get a config by name
		if (!u.pathname.startsWith('/api/configs/')) {
			throw new Error(`assert failed, ${u.pathname} doesn't start as expected`);
		}

		let key = u.pathname.slice('/api/configs/'.length);
		key = querystring.unescape(key);
		if (configExists(key)) {
			let file = getConfigFilename(key);
			fs.readFile(file, 'utf8', (err, data) => {
				if (err) {
					throw err;
				}
				writejson.write({success: true, configuration: JSON.parse(data)}, response);
			});
		} else {
			writejson.write({success: false}, response, 404);
		}
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
	} else if (request.method === 'PATCH' && u.pathname === '/api/configs/') {
		// create a config
		postdata.get(request).then(data => {
			let config = JSON.parse(data);
			if (!config.name) {
				return errors.abortRequest(request, response, 500, 'No name given');
			}
			if (!configExists(config.name)) {
				// known issue: race condition here
				return errors.abortRequest(request, response, 404, 'Does not exist');
			}
			let file = getConfigFilename(config.name);
			fs.writeFile(file, data, 'utf8', (err) => {
				if (err) {
					throw err;
				}
				writejson.write({
					success: true,
					msg: 'updated ' + config.name,
					uri: '/api/configs/' + querystring.escape(config.name)
				}, response);
			});
		});
	} else if (request.method === 'DELETE') {
		// delete a config by name
		if (!u.pathname.startsWith('/api/configs/')) {
			throw new Error(`assert failed, ${u.pathname} doesn't start as expected`);
		}

		let key = u.pathname.slice('/api/configs/'.length);
		key = querystring.unescape(key);

		if (configExists(key)) {
			let file = getConfigFilename(key);
			fs.unlink(file, err => {
				if (err) {
					throw err;
				}
				writejson.write({success: true}, response);
			});
		} else {
			writejson.write({success: false}, response, 404);
		}
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

function isInt(n) {
	return (n+'').match(/^[0-9]+$/);
}
