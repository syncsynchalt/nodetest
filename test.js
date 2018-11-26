#!/usr/bin/env node

let fs = require('fs');
let child_process = require('child_process');
let util = require('util');

fs.readdir('./tests', async (err, items) => {
	if (err) {
		throw err;
	}

	const exec = util.promisify(child_process.exec);
	for (let item of items) {
		if (item.startsWith('.')) {
			continue;
		}
		console.log(`node tests/${item}`);
		let result = await exec(`node tests/${item}`);
		if (result.stdout) {
			console.log(result.stdout);
		}
		if (result.stderr) {
			console.warn(result.stderr);
		}
	}
	console.log('Success');
});
