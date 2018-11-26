let fs = require('fs');

exports.readFile = async (path, charset) => {
	return new Promise((resolve, reject) => {
		fs.readFile(path, charset, (err, data) => {
			if (err) {
				reject(err);
			}
			resolve(data);
		});
	});
};

exports.writeFile = async (path, data, charset) => {
	return new Promise((resolve, reject) => {
		fs.writeFile(path, data, charset, (err) => {
			if (err) {
				reject(err);
			}
			resolve(true);
		});
	});
};

exports.unlink = async (path) => {
	return new Promise((resolve, reject) => {
		fs.unlink(path, (err) => {
			if (err) {
				reject(err);
			}
			resolve(true);
		});
	});
};

exports.stat = async (path) => {
	return new Promise((resolve, reject) => {
		fs.stat(path, (err, stats) => {
			if (err) {
				reject(err);
			}
			resolve(stats);
		});
	});
};
